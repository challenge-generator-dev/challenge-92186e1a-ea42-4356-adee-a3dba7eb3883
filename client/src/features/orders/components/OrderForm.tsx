import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, OrderFormData } from '../validators/order.validator';
import { Button } from '@shared/components/Button';

interface OrderFormProps {
  initialData?: OrderFormData;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditMode = false,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: initialData || {
      customerName: '',
      customerEmail: '',
      items: [],
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'MX',
      },
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const watchedItems = watch('items');

  const handleAddItem = () => {
    const currentItems = watchedItems || [];
    setValue('items', [
      ...currentItems,
      { productId: '', productName: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = watchedItems || [];
    setValue(
      'items',
      currentItems.filter((_, i) => i !== index)
    );
  };

  const calculateTotal = (): number => {
    const items = watchedItems || [];
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleFormSubmit = (data: OrderFormData) => {
    onSubmit(data);
    if (!isEditMode) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isEditMode ? 'Editar Orden' : 'Nueva Orden'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del Cliente
            </label>
            <input
              id="customerName"
              type="text"
              {...register('customerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre completo"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customerEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="customerEmail"
              type="email"
              {...register('customerEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerEmail.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Dirección de Envío
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Calle
              </label>
              <input
                id="street"
                type="text"
                {...register('shippingAddress.street')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.street && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.street.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                {...register('shippingAddress.city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <input
                id="state"
                type="text"
                {...register('shippingAddress.state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.state.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código Postal
              </label>
              <input
                id="zipCode"
                type="text"
                {...register('shippingAddress.zipCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.zipCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                País
              </label>
              <select
                id="country"
                {...register('shippingAddress.country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MX">México</option>
                <option value="US">Estados Unidos</option>
                <option value="CA">Canadá</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-800">Productos</h4>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddItem}
            >
              + Agregar Producto
            </Button>
          </div>

          {watchedItems && watchedItems.length > 0 ? (
            <div className="space-y-3">
              {watchedItems.map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="ID Producto"
                      {...register(`items.${index}.productId`)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del Producto"
                      {...register(`items.${index}.productName`)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Cantidad"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min={1}
                    />
                    <input
                      type="number"
                      placeholder="Precio Unitario"
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No hay productos agregados. Haz clic en &quot;Agregar Producto&quot; para
              añadir uno.
            </p>
          )}

          {errors.items && (
            <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas Adicionales
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Instrucciones especiales, preferencias, etc."
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-900">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar Orden'
                  : 'Crear Orden'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}