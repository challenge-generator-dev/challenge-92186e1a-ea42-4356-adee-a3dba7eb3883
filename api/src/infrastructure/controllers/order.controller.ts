import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrderService } from '../../application/order.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { OrderEntity } from '../../domain/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflicto al crear la orden',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID de orden inválido',
  })
  async getOrder(@Param('id') id: string): Promise<OrderEntity> {
    return this.orderService.getOrder(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de actualización inválidos',
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID de orden inválido',
  })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes con filtros opcionales' })
  @ApiQuery({
    name: 'customerId',
    description: 'Filtrar órdenes por ID de cliente',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de órdenes',
    type: [OrderEntity],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parámetros de consulta inválidos',
  })
  async listOrders(
    @Query('customerId') customerId?: string,
  ): Promise<OrderEntity[]> {
    return this.orderService.listOrders(customerId);
  }
}