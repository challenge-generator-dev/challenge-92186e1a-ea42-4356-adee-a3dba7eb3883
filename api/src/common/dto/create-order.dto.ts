import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de órdenes.
 * Contiene validaciones para asegurar la integridad de los datos.
 */
export class CreateOrderItemDto {
    @ApiProperty({ description: 'ID del producto', example: 'prod-12345' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Cantidad del producto', example: 2 })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({ description: 'Precio unitario del producto', example: 19.99 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ description: 'Nombre del producto (opcional)', example: 'Camiseta', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'ID del cliente', example: 'cust-67890' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({
        description: 'Lista de items de la orden',
        type: [CreateOrderItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiProperty({
        description: 'Versión de la orden para control de concurrencia (opcional)',
        example: 1,
        required: false
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    version?: number;
}