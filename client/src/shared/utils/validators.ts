import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'El ID del cliente es requerido'),
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  items: z
    .array(orderItemSchema)
    .min(1, 'Debe incluir al menos un producto en la orden'),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto').optional(),
});

export const orderStatusValues = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export function validateCreateOrder(data: unknown) {
  return createOrderSchema.safeParse(data);
}

export function validateUpdateOrder(data: unknown) {
  return updateOrderSchema.safeParse(data);
}

export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email('Email inválido');
  const result = emailSchema.safeParse(email);
  return result.success;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} es requerido`;
  }
  return null;
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  return null;
}

export function validateMaxLength(value: string, max: number, fieldName: string): string | null {
  if (value.length > max) {
    return `${fieldName} no puede exceder ${max} caracteres`;
  }
  return null;
}

export function validatePositiveNumber(value: number, fieldName: string): string | null {
  if (value <= 0) {
    return `${fieldName} debe ser mayor a 0`;
  }
  return null;
}

export function validateDateRange(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    return 'La fecha de inicio debe ser anterior a la fecha fin';
  }
  return null;
}

export function getFieldErrors<T>(errors: z.ZodError): Record<keyof T, string> {
  const fieldErrors: Record<string, string> = {};
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = error.message;
    }
  });
  return fieldErrors as Record<keyof T, string>;
}

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;