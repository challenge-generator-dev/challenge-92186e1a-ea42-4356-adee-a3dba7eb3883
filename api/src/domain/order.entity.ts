import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

type OrderStatusTransitionMap = {
  [K in OrderStatus]: OrderStatus[];
};

const validTransitions: OrderStatusTransitionMap = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export class OrderEntity {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;

  constructor(
    customerId: string,
    items: OrderItem[],
    status?: OrderStatus,
    id?: string,
    totalAmount?: number,
    createdAt?: Date,
    updatedAt?: Date,
    version?: number,
  ) {
    this.id = id || uuidv4();
    this.customerId = customerId;
    this.items = items;
    this.status = status || OrderStatus.PENDING;
    this.totalAmount = totalAmount || this.calculateTotalAmount();
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.version = version || 1;
    this.validate();
  }

  private calculateTotalAmount(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  private validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('El customerId no puede estar vacío');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('La orden debe tener al menos un item');
    }
    if (this.totalAmount < 0) {
      throw new Error('El totalAmount no puede ser negativo');
    }
    if (
      this.items.some((item) => item.quantity <= 0 || item.price <= 0)
    ) {
      throw new Error('Todos los items deben tener precio y cantidad positivos');
    }
  }

  updateStatus(newStatus: OrderStatus): void {
    const allowed = validTransitions[this.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Transición de estado no permitida: ${this.status} -> ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    this.version += 1;
  }

  updateItems(newItems: OrderItem[]): void {
    this.items = newItems;
    this.totalAmount = this.calculateTotalAmount();
    this.updatedAt = new Date();
    this.version += 1;
    this.validate();
  }
}