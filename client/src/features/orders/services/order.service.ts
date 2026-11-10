import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderEntity {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  total: number;
  status?: OrderStatus;
  notes?: string;
}

export interface UpdateOrderDto {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: ShippingAddress;
  total?: number;
  status?: OrderStatus;
  notes?: string;
}

export interface OrderListQueryParams {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export function orderFormDataToCreateOrderDto(formData: OrderFormData): CreateOrderDto {
  const total = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return {
    customerId: formData.customerEmail,
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    items: formData.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
    shippingAddress: formData.shippingAddress,
    total,
    status: 'pending',
    notes: formData.notes,
  };
}

class OrderService {
  private readonly client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const response = await this.client.post<OrderEntity>('/orders', data);
    return response.data;
  }

  async getOrder(id: string): Promise<OrderEntity> {
    const response = await this.client.get<OrderEntity>(`/orders/${id}`);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const response = await this.client.put<OrderEntity>(`/orders/${id}`, data);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }

  async listOrders(params?: OrderListQueryParams): Promise<OrderEntity[]> {
    const response = await this.client.get<OrderEntity[]>('/orders', { params });
    return response.data;
  }
}

export const orderService = new OrderService();