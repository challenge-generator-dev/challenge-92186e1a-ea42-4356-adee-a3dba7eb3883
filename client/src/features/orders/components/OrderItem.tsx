import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Modal } from '@shared/components/Modal';

interface OrderItemData {
  id: string;
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
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItemProps {
  order: OrderItemData;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  getStatusColor: (status: OrderItemData['status']) => string;
  getStatusLabel: (status: OrderItemData['status']) => string;
}

export function OrderItem({
  order,
  onEdit,
  onDelete,
  onViewDetails,
  getStatusColor,
  getStatusLabel,
}: OrderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getItemCount = () => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openDetailsModal = () => {
    setDetailsModalOpen(true);
    onViewDetails();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div
          className="p-4 cursor-pointer"
          onClick={toggleExpanded}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleExpanded();
            }
          }}
          aria-expanded={isExpanded}
          aria-label={`Detalles de la orden ${order.id}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-500">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.customerName}
              </h3>
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{getItemCount()} productos</span>
                <span>•</span>
                <span>{formatCurrency(order.total)}</span>
                <span>•</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDetailsModal();
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Ver detalles de la orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                aria-label="Editar orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Eliminar orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Dirección de Envío
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    <br />
                    {order.shippingAddress.zipCode},{' '}
                    {order.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Productos
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.productName} x{item.quantity} ={' '}
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </h4>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400">
                <p>Creada: {formatDate(order.createdAt)}</p>
                <p>Última actualización: {formatDate(order.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Orden #${order.id.slice(0, 8).toUpperCase()}`}
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Estado:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Dirección de Envío
            </h4>
            <p className="text-gray-700">{order.shippingAddress.street}</p>
            <p className="text-gray-700">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-700">{order.shippingAddress.country}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Producto</th>
                  <th className="text-right py-2">Cant.</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="text-right py-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={3} className="text-right py-3">
                    Total:
                  </td>
                  <td className="text-right py-3">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {order.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>ID: {order.id}</p>
            <p>Creada: {formatDate(order.createdAt)}</p>
            <p>Actualizada: {formatDate(order.updatedAt)}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDetailsModalOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDetailsModalOpen(false);
                onEdit();
              }}
            >
              Editar Orden
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}