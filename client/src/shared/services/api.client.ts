import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderEntity {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderDto {
  customerId: string;
  customerName: string;
  items: OrderItem[];
}

interface UpdateOrderDto {
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items?: OrderItem[];
}

interface ListOrdersParams {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<CreateOrderDto> = {
      method: 'POST',
      url: '/orders',
      data,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async getOrder(id: string): Promise<OrderEntity> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/orders/${id}`,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<UpdateOrderDto> = {
      method: 'PUT',
      url: `/orders/${id}`,
      data,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/orders/${id}`,
    };
    await this.client.request(config);
  }

  async listOrders(params?: ListOrdersParams): Promise<OrderEntity[]> {
    const url = params
      ? `/orders${this.buildQueryString(params as Record<string, unknown>)}`
      : '/orders';
    const config: AxiosRequestConfig = {
      method: 'GET',
      url,
    };
    const response: AxiosResponse<OrderEntity[]> = await this.client.request(config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export type { OrderEntity, CreateOrderDto, UpdateOrderDto, OrderItem, ListOrdersParams };