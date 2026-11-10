import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { OrderItem, OrderStatus } from '../../domain/order.entity';

@ValidatorConstraint({ name: 'orderItems', async: false })
@Injectable()
export class OrderItemsValidator implements ValidatorConstraintInterface {
  validate(items: OrderItem[], args: ValidationArguments): boolean {
    if (!Array.isArray(items) || items.length === 0) {
      return false;
    }

    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return false;
      }
      if (
        typeof item.quantity !== 'number' ||
        item.quantity <= 0 ||
        !Number.isInteger(item.quantity)
      ) {
        return false;
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Cada item de la orden debe tener un productId válido, una cantidad mayor a 0 y un precio no negativo';
  }
}

@ValidatorConstraint({ name: 'validOrderStatus', async: false })
@Injectable()
export class ValidOrderStatusValidator implements ValidatorConstraintInterface {
  private readonly validStatuses = Object.values(OrderStatus);

  validate(status: string, args: ValidationArguments): boolean {
    if (!status || typeof status !== 'string') {
      return false;
    }
    return this.validStatuses.includes(status as OrderStatus);
  }

  defaultMessage(args: ValidationArguments): string {
    return `El estado de la orden debe ser uno de: ${this.validStatuses.join(', ')}`;
  }
}

@ValidatorConstraint({ name: 'orderStatusTransition', async: false })
@Injectable()
export class OrderStatusTransitionValidator implements ValidatorConstraintInterface {
  private readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PROCESSING]: [
      OrderStatus.SHIPPED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  validate(
    transition: { from: OrderStatus; to: OrderStatus },
    args: ValidationArguments,
  ): boolean {
    if (!transition || !transition.from || !transition.to) {
      return false;
    }

    const allowed = this.allowedTransitions[transition.from];
    if (!allowed || !Array.isArray(allowed)) {
      return false;
    }
    return allowed.includes(transition.to);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'La transición de estado no es válida para esta orden';
  }
}

@ValidatorConstraint({ name: 'customerId', async: false })
@Injectable()
export class CustomerIdValidator implements ValidatorConstraintInterface {
  private readonly customerIdPattern = /^[A-Z0-9]{8,12}$/i;

  validate(customerId: string, args: ValidationArguments): boolean {
    if (!customerId || typeof customerId !== 'string') {
      return false;
    }
    return this.customerIdPattern.test(customerId);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El customerId debe ser un identificador alfanumérico de 8 a 12 caracteres';
  }
}

@ValidatorConstraint({ name: 'positiveTotalAmount', async: false })
@Injectable()
export class PositiveTotalAmountValidator implements ValidatorConstraintInterface {
  validate(totalAmount: number, args: ValidationArguments): boolean {
    if (typeof totalAmount !== 'number') {
      return false;
    }
    return totalAmount >= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El monto total debe ser un valor no negativo';
  }
}

@Injectable()
export class OrderValidationService {
  constructor(
    private readonly itemsValidator: OrderItemsValidator,
    private readonly statusValidator: ValidOrderStatusValidator,
    private readonly transitionValidator: OrderStatusTransitionValidator,
    private readonly customerIdValidator: CustomerIdValidator,
    private readonly totalAmountValidator: PositiveTotalAmountValidator,
  ) {}

  validateItems(items: OrderItem[]): boolean {
    return this.itemsValidator.validate(items, {} as ValidationArguments);
  }

  validateStatus(status: string): boolean {
    return this.statusValidator.validate(status, {} as ValidationArguments);
  }

  validateTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.transitionValidator.validate(
      { from, to },
      {} as ValidationArguments,
    );
  }

  validateCustomerId(customerId: string): boolean {
    return this.customerIdValidator.validate(customerId, {} as ValidationArguments);
  }

  validateTotalAmount(totalAmount: number): boolean {
    return this.totalAmountValidator.validate(totalAmount, {} as ValidationArguments);
  }

  getValidationErrorMessage(validator: ValidatorConstraintInterface): string {
    if (typeof validator.defaultMessage === 'function') {
      return validator.defaultMessage({} as ValidationArguments);
    }
    return 'Error de validación desconocido';
  }
}