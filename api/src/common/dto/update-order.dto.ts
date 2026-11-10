import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderItemDto {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: 'prod-123',
    type: String,
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'Cantidad del producto Ordered',
    example: 2,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 29.99,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Nombre opcional del producto',
    example: 'Producto de Ejemplo',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  constructor(partial: Partial<UpdateOrderItemDto>) {
    this.productId = partial.productId ?? '';
    this.quantity = partial.quantity ?? 0;
    this.price = partial.price ?? 0;
    this.name = partial.name;
  }
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Identificador del cliente que realiza la orden',
    example: 'cust-456',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Lista de items de la orden',
    type: [UpdateOrderItemDto],
    required: false,
    example: [
      { productId: 'prod-123', quantity: 2, price: 29.99, name: 'Producto A' },
      { productId: 'prod-456', quantity: 1, price: 49.99, name: 'Producto B' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Versión para control de concurrencia optimista',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  version?: number;

  constructor(partial: Partial<UpdateOrderDto>) {
    this.customerId = partial.customerId;
    this.items = partial.items;
    this.status = partial.status;
    this.version = partial.version;
  }
}