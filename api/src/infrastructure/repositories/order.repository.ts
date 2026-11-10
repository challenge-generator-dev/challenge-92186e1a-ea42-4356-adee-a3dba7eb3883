import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OrderEntity, OrderStatus } from '../../domain/order.entity';
import { ConfigService } from '@nestjs/config';

/**
 * Repositorio que implementa las operaciones de persistencia para órdenes en DynamoDB.
 * Utiliza el patrón de puerto y adaptador para desacoplar el dominio de la infraestructura.
 */
@Injectable()
export class OrderRepository {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(private readonly configService: ConfigService) {
        const dynamoDBClient = new DynamoDBClient({
            region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
            endpoint: this.configService.get<string>('DYNAMODB_ENDPOINT')
        });
        this.client = DynamoDBDocumentClient.from(dynamoDBClient);
        this.tableName = this.configService.get<string>('DYNAMODB_TABLE', 'Orders');
    }

    async create(order: OrderEntity): Promise<OrderEntity> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                id: order.id,
                customerId: order.customerId,
                items: order.items,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                version: order.version,
                PK: `CUSTOMER#${order.customerId}`,
                SK: `ORDER#${order.id}`
            },
            ConditionExpression: 'attribute_not_exists(id)'
        });

        try {
            await this.client.send(command);
            return order;
        } catch (error) {
            if (error.name === 'ConditionalCheckFailedException') {
                throw new Error('La orden ya existe');
            }
            throw new Error(`Error al crear la orden: ${error.message}`);
        }
    }

    async findById(id: string): Promise<OrderEntity | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id }
        });

        const result = await this.client.send(command);
        if (!result.Item) {
            return null;
        }

        return this.mapDynamoItemToOrderEntity(result.Item);
    }

    async update(order: OrderEntity): Promise<OrderEntity> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { id: order.id },
            UpdateExpression: 
                'SET customerId = :customerId, items = :items, status = :status, '
                + 'totalAmount = :totalAmount, updatedAt = :updatedAt, version = :version',
            ExpressionAttributeValues: {
                ':customerId': order.customerId,
                ':items': order.items,
                ':status': order.status,
                ':totalAmount': order.totalAmount,
                ':updatedAt': order.updatedAt.toISOString(),
                ':version': order.version
            },
            ReturnValues: 'ALL_NEW'
        });

        try {
            const result = await this.client.send(command);
            return this.mapDynamoItemToOrderEntity(result.Attributes);
        } catch (error) {
            throw new Error(`Error al actualizar la orden: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: { id }
        });

        try {
            await this.client.send(command);
        } catch (error) {
            throw new Error(`Error al eliminar la orden: ${error.message}`);
        }
    }

    async findByCustomerId(customerId: string): Promise<OrderEntity[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': `CUSTOMER#${customerId}`
            }
        });

        const result = await this.client.send(command);
        if (!result.Items || result.Items.length === 0) {
            return [];
        }

        return result.Items.map(item => this.mapDynamoItemToOrderEntity(item));
    }

    private mapDynamoItemToOrderEntity(item: any): OrderEntity {
        return new OrderEntity(
            item.customerId,
            item.items,
            item.status as OrderStatus,
            item.id,
            item.totalAmount,
            new Date(item.createdAt),
            new Date(item.updatedAt),
            item.version
        );
    }
}