import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import {
  OrderItemsValidator,
  ValidOrderStatusValidator,
  OrderStatusTransitionValidator,
  CustomerIdValidator,
  PositiveTotalAmountValidator,
  OrderValidationService,
} from './common/validators/order.validator';
import { HttpExceptionFilter, GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor, LoggingInterceptor, TransformInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [],
    }),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'DYNAMODB_DOCUMENT_CLIENT',
      useFactory: (configService: ConfigService) => {
        const client = new DynamoDBClient({
          region: configService.get('AWS_REGION') || 'us-east-1',
          endpoint: configService.get('AWS_ENDPOINT'),
          credentials: configService.get('AWS_ACCESS_KEY_ID')
            ? {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY') || '',
              }
            : undefined,
        });
        return DynamoDBDocumentClient.from(client, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'DYNAMODB_TABLE_NAME',
      useFactory: (configService: ConfigService) => {
        return configService.get('DYNAMODB_TABLE_NAME') || 'orders';
      },
      inject: [ConfigService],
    },
    OrderRepository,
    OrderItemsValidator,
    ValidOrderStatusValidator,
    OrderStatusTransitionValidator,
    CustomerIdValidator,
    PositiveTotalAmountValidator,
    OrderValidationService,
    OrderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new (require('@nestjs/common').ValidationPipe)({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  exports: [OrderService, OrderRepository],
})
export class AppModule {}