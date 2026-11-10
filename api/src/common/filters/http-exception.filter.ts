import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
  traceId?: string;
  validationErrors?: Record<string, string[]>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = this.buildErrorResponse(
      status,
      exceptionResponse,
      request,
    );

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private buildErrorResponse(
    status: HttpStatus,
    exceptionResponse: string | object,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let message: string;
    let error: string;
    let validationErrors: Record<string, string[]> | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = HttpStatus[status];
    } else {
      const resp = exceptionResponse as Record<string, unknown>;
      const respMessage = resp.message;
      
      if (Array.isArray(respMessage)) {
        message = respMessage.join(', ');
      } else if (typeof respMessage === 'string') {
        message = respMessage;
      } else {
        message = HttpStatus[status];
      }
      
      error = (resp.error as string) || HttpStatus[status];

      if (respMessage && Array.isArray(respMessage)) {
        validationErrors = this.extractValidationErrors(respMessage);
      }
    }

    return {
      statusCode: status,
      message,
      error,
      timestamp,
      path,
      method,
      traceId: (request.headers['x-trace-id'] as string) || undefined,
      validationErrors,
    };
  }

  private extractValidationErrors(
    messages: string[] | unknown,
  ): Record<string, string[]> | undefined {
    if (!Array.isArray(messages)) {
      return undefined;
    }

    const errors: Record<string, string[]> = {};

    for (const msg of messages) {
      if (typeof msg === 'string' && msg.includes(':')) {
        const [field, ...rest] = msg.split(':');
        const errorMessage = rest.join(':').trim();

        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(errorMessage);
      }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        const respMessage = resp.message;
        
        if (Array.isArray(respMessage)) {
          message = respMessage.join(', ');
        } else if (typeof respMessage === 'string') {
          message = respMessage;
        }
        
        error = ((resp.error as string) || error);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      traceId: (request.headers['x-trace-id'] as string) || undefined,
    };

    response.status(status).json(errorResponse);
  }
}