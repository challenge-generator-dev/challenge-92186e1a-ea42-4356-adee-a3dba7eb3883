import { z } from 'zod';

export const orderSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido').max(100, 'Máximo 100 caracteres'),
  customerEmail: z.string().email('Correo electrónico inválido'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'ID del producto requerido'),
      productName: z.string().min(1, 'Nombre del producto requerido'),
      quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
      unitPrice: z.number().min(0, 'El precio no puede ser negativo'),
    })
  ).min(1, 'Debe incluir al menos un producto'),
  shippingAddress: z.object({
    street: z.string().min(1, 'La calle es requerida').max(200, 'Máximo 200 caracteres'),
    city: z.string().min(1, 'La ciudad es requerida').max(100, 'Máximo 100 caracteres'),
    state: z.string().min(1, 'El estado es requerido').max(100, 'Máximo 100 caracteres'),
    zipCode: z.string().min(1, 'El código postal es requerido').max(20, 'Máximo 20 caracteres'),
    country: z.string().min(2, 'El país es requerido').max(2, 'Código de país inválido'),
  }),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;