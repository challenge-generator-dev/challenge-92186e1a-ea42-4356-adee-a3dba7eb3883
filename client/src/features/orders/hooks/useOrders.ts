import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  orderService,
  CreateOrderDto,
  UpdateOrderDto,
  OrderEntity,
  OrderListQueryParams,
} from '../services/order.service';

const ORDER_QUERY_KEY = 'orders';
const ORDER_DETAIL_KEY = 'order';

export interface UseOrdersOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrders(params?: OrderListQueryParams, options?: UseOrdersOptions) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderEntity[], Error>({
    queryKey: [ORDER_QUERY_KEY, params],
    queryFn: () => orderService.listOrders(params),
    staleTime: 30000,
    gcTime: 300000,
  });

  const createMutation = useMutation<OrderEntity, Error, CreateOrderDto>({
    mutationFn: (data) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const updateMutation = useMutation<
    OrderEntity,
    Error,
    { id: string; data: UpdateOrderDto }
  >({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      queryClient.setQueryData([ORDER_DETAIL_KEY, data.id], data);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createOrder: createMutation.mutate,
    createOrderAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

export function useOrder(id: string, options?: UseOrdersOptions) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderEntity, Error>({
    queryKey: [ORDER_DETAIL_KEY, id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    staleTime: 30000,
    gcTime: 300000,
  });

  const updateMutation = useMutation<
    OrderEntity,
    Error,
    { id: string; data: UpdateOrderDto }
  >({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData([ORDER_DETAIL_KEY, data.id], data);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}