import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ApiResponse<T> {
  data?: T;
  meta?: {
    timestamp: string;
    path: string;
    method: string;
    duration: number;
    page?: number;
    limit?: number;
    total?: number;
  };
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${method}] ${url} - Status: ${response.statusCode} - Duration: ${duration}ms`,
        );
      }),
      map((data) => {
        const duration = Date.now() - startTime;
        const isPaginated = data && typeof data === 'object' && 'data' in data;

        const responsePayload: ApiResponse<T> = {
          data: isPaginated ? (data as { data: T }).data : data,
          meta: {
            timestamp: new Date().toISOString(),
            path: url,
            method,
            duration,
            ...(isPaginated && {
              page: (data as { page?: number }).page,
              limit: (data as { limit?: number }).limit,
              total: (data as { total?: number }).total,
            }),
          },
        };

        if (response.statusCode === HttpStatus.CREATED) {
          responsePayload.message = 'Recurso creado exitosamente';
        } else if (response.statusCode === HttpStatus.NO_CONTENT) {
          delete responsePayload.data;
          responsePayload.message = 'Recurso eliminado exitosamente';
        }

        return responsePayload;
      }),
    );
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, headers, body } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = headers['x-forwarded-for'] || request.ip || 'unknown';

    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `Request Completed: ${method} ${url} - Duration: ${duration}ms`,
        );
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, T | T[] | null>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | T[] | null> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return null;
        }

        if (Array.isArray(data)) {
          return data.map((item) => this.transformItem(item));
        }

        return this.transformItem(data);
      }),
    );
  }

  private transformItem(item: T): T {
    if (typeof item === 'object' && item !== null) {
      const transformed = { ...item } as Record<string, unknown>;

      for (const [key, value] of Object.entries(transformed)) {
        if (value instanceof Date) {
          transformed[key] = value.toISOString();
        }
      }

      return transformed as T;
    }

    return item;
  }
}