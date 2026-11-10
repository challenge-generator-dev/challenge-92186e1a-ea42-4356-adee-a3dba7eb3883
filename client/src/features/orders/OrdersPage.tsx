import { useState, useCallback } from 'react';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from './services/order.service';
import { useOrders } from './hooks/useOrders';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';

export interface OrderFormData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

function orderEntityToOrder(entity: OrderEntity) {
  return {
    id: entity.id,
    customerName: '',
    customerEmail: '',
    items: entity.items.map((item) => ({
      productId: item.productId,
      productName: '',
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    total: entity.total,
    status: entity.status,
    notes: undefined,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function orderFormDataToCreateOrderDto(data: OrderFormData): CreateOrderDto {
  return {
    customerId: data.customerId,
    items: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: data.total,
    status: data.status,
  };
}

function orderFormDataToUpdateOrderDto(data: OrderFormData): UpdateOrderDto {
  return {
    customerId: data.customerId,
    items: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: data.total,
    status: data.status,
  };
}

interface OrdersPageState {
  isFormModalOpen: boolean;
  editingOrder: OrderEntity | null;
  selectedOrder: OrderEntity | null;
  isDetailsModalOpen: boolean;
  searchQuery: string;
  statusFilter: string;
}

const initialState: OrdersPageState = {
  isFormModalOpen: false,
  editingOrder: null,
  selectedOrder: null,
  isDetailsModalOpen: false,
  searchQuery: '',
  statusFilter: '',
};

function OrdersPage() {
  const [state, setState] = useState<OrdersPageState>(initialState);

  const handleOrderSuccess = useCallback(() => {
    closeFormModal();
  }, []);

  const handleOrderError = useCallback((err: Error) => {
    console.error('Error en operación de órdenes:', err.message);
  }, []);

  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch,
  } = useOrders({
    onSuccess: handleOrderSuccess,
    onError: handleOrderError,
  });

  const openCreateModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: true,
      editingOrder: null,
    }));
  }, []);

  const openEditModal = useCallback((order: OrderEntity) => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: true,
      editingOrder: order,
    }));
  }, []);

  const closeFormModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: false,
      editingOrder: null,
    }));
  }, []);

  const openDetailsModal = useCallback((order: OrderEntity) => {
    setState((prev) => ({
      ...prev,
      selectedOrder: order,
      isDetailsModalOpen: true,
    }));
  }, []);

  const closeDetailsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedOrder: null,
      isDetailsModalOpen: false,
    }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setState((prev) => ({ ...prev, statusFilter: status }));
  }, []);

  const handleSubmit = useCallback(
    async (data: OrderFormData) => {
      try {
        if (state.editingOrder) {
          const updateDto = orderFormDataToUpdateOrderDto(data);
          await updateOrder({
            id: state.editingOrder.id,
            data: updateDto,
          });
        } else {
          const createDto = orderFormDataToCreateOrderDto(data);
          await createOrder(createDto);
        }
      } catch (err) {
        console.error('Error al guardar orden:', err);
        throw err;
      }
    },
    [state.editingOrder, createOrder, updateOrder]
  );

  const handleDelete = useCallback(
    async (orderId: string) => {
      if (window.confirm('¿Está seguro de que desea eliminar esta orden?')) {
        try {
          await deleteOrder(orderId);
          refetch();
        } catch (err) {
          console.error('Error al eliminar orden:', err);
        }
      }
    },
    [deleteOrder, refetch]
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !state.searchQuery ||
      order.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(state.searchQuery.toLowerCase());

    const matchesStatus =
      !state.statusFilter || order.status === state.statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const ordersForList = sortedOrders.map(orderEntityToOrder);

  const getStatusColor = useCallback((status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      processing: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      processing: 'Procesando',
      completed: 'Completado',
    };
    return labels[status] || status;
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const handleEditFromList = useCallback(
    (order: { id: string }) => {
      const found = orders.find((o) => o.id === order.id);
      if (found) {
        openEditModal(found);
      }
    },
    [orders, openEditModal]
  );

  const handleDeleteFromList = useCallback(
    (order: { id: string }) => {
      handleDelete(order.id);
    },
    [handleDelete]
  );

  const handleViewDetailsFromList = useCallback(
    (order: { id: string }) => {
      const found = orders.find((o) => o.id === order.id);
      if (found) {
        openDetailsModal(found);
      }
    },
    [orders, openDetailsModal]
  );

  const initialFormData: OrderFormData | undefined = state.editingOrder
    ? {
        customerId: state.editingOrder.customerId,
        customerName: '',
        customerEmail: '',
        items: state.editingOrder.items.map((item) => ({
          productId: item.productId,
          productName: '',
          quantity: item.quantity,
          price: item.price,
        })),
        total: state.editingOrder.total,
        status: state.editingOrder.status,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Órdenes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra las órdenes de tus clientes
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          Nueva Orden
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Error al cargar las órdenes: {error.message}
          </p>
        </div>
      )}

      <OrderList
        orders={ordersForList}
        isLoading={isLoading}
        onEdit={handleEditFromList}
        onDelete={handleDeleteFromList}
        onViewDetails={handleViewDetailsFromList}
        searchQuery={state.searchQuery}
        statusFilter={state.statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <Modal
        isOpen={state.isFormModalOpen}
        onClose={closeFormModal}
        title={state.editingOrder ? 'Editar Orden' : 'Nueva Orden'}
        size="xl"
      >
        <OrderForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          onCancel={closeFormModal}
          isLoading={isLoading}
          isEditMode={!!state.editingOrder}
        />
      </Modal>

      <Modal
        isOpen={state.isDetailsModalOpen}
        onClose={closeDetailsModal}
        title="Detalles de la Orden"
        size="lg"
      >
        {state.selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID de Orden</h4>
                <p className="text-gray-900 font-mono text-sm">
                  {state.selectedOrder.id}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    state.selectedOrder.status
                  )}`}
                >
                  {getStatusLabel(state.selectedOrder.status)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID de Cliente</h4>
                <p className="text-gray-900">
                  {state.selectedOrder.customerId || 'No especificado'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total</h4>
                <p className="text-gray-900 font-semibold">
                  {formatCurrency(state.selectedOrder.total)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fecha de Creación</h4>
                <p className="text-gray-900">
                  {formatDate(state.selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Productos ({state.selectedOrder.items.length})
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.productId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {state.selectedOrder.updatedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Última Actualización</h4>
                <p className="text-gray-900">
                  {formatDate(state.selectedOrder.updatedAt)}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={closeDetailsModal}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrdersPage;