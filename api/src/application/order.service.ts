import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderEntity, OrderStatus } from '../domain/order.entity';
import { CreateOrderDto } from '../common/dto/create-order.dto';
import { UpdateOrderDto } from '../common/dto/update-order.dto';
import {
  OrderValidationService,
  OrderItemsValidator,
  ValidOrderStatusValidator,
  CustomerIdValidator,
} from '../common/validators/order.validator';

@Injectable()
export class OrderService {
  private readonly MAX_ITEMS_PER_ORDER = 100;
  private readonly MAX_QUANTITY_PER_ITEM = 999;
  private readonly MIN_ORDER_AMOUNT = 0.01;
  private readonly MAX_ORDER_AMOUNT = 1000000;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly validationService: OrderValidationService,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    this.validateCreateOrderInput(dto);

    const items = dto.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const order = new OrderEntity(
      dto.customerId,
      items,
      OrderStatus.PENDING,
      undefined,
      undefined,
      undefined,
      undefined,
      dto.version ?? 1,
    );

    try {
      const createdOrder = await this.orderRepository.create(order);
      return createdOrder;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'Ya existe una orden con el mismo ID. Por favor, intente de nuevo.',
        );
      }
      throw error;
    }
  }

  async getOrder(id: string): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
    const existingOrder = await this.getOrder(id);

    if (dto.status !== undefined) {
      this.validateStatusTransition(existingOrder.status, dto.status);
      existingOrder.updateStatus(dto.status);
    }

    if (dto.items !== undefined) {
      this.validateItemsUpdate(dto.items);
      existingOrder.updateItems(
        dto.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      );
    }

    existingOrder.version += 1;
    existingOrder.updatedAt = new Date();

    const updatedOrder = await this.orderRepository.update(existingOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.getOrder(id);
    await this.orderRepository.delete(id);
  }

  async listOrders(customerId?: string): Promise<OrderEntity[]> {
    if (customerId) {
      if (!this.validationService.validateCustomerId(customerId)) {
        throw new BadRequestException(
          this.validationService.getValidationErrorMessage(
            new CustomerIdValidator(),
          ),
        );
      }
      return this.orderRepository.findByCustomerId(customerId);
    }

    return [];
  }

  private validateCreateOrderInput(dto: CreateOrderDto): void {
    if (!dto.customerId) {
      throw new BadRequestException('El customerId es requerido');
    }

    if (!this.validationService.validateCustomerId(dto.customerId)) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(
          new CustomerIdValidator(),
        ),
      );
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'La orden debe contener al menos un item',
      );
    }

    if (dto.items.length > this.MAX_ITEMS_PER_ORDER) {
      throw new BadRequestException(
        `La orden no puede tener más de ${this.MAX_ITEMS_PER_ORDER} items`,
      );
    }

    for (const item of dto.items) {
      if (item.quantity > this.MAX_QUANTITY_PER_ITEM) {
        throw new BadRequestException(
          `La cantidad del producto ${item.productId} excede el límite de ${this.MAX_QUANTITY_PER_ITEM}`,
        );
      }
    }

    if (
      !this.validationService.validateItems(
        dto.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      )
    ) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(new OrderItemsValidator()),
      );
    }
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: string,
  ): void {
    if (!this.validationService.validateTransition(currentStatus, newStatus as OrderStatus)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
      );
    }
  }

  private validateItemsUpdate(
    items: Array<{ productId: string; quantity: number; price: number; name?: string }>,
  ): void {
    if (!items || items.length === 0) {
      throw new BadRequestException(
        'La orden debe contener al menos un item',
      );
    }

    if (items.length > this.MAX_ITEMS_PER_ORDER) {
      throw new BadRequestException(
        `La orden no puede tener más de ${this.MAX_ITEMS_PER_ORDER} items`,
      );
    }

    if (
      !this.validationService.validateItems(
        items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      )
    ) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(new OrderItemsValidator()),
      );
    }
  }

  private isDuplicateKeyError(error: any): boolean {
    const errorMessage = error?.message || '';
    return (
      errorMessage.includes('DuplicateKey') ||
      errorMessage.includes('conditional check failed') ||
      error?.code === 'ConditionalCheckFailedException'
    );
  }
}