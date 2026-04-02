import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import {
  IsAdapterInvariantError,
  IsAdapterServerError,
} from '../../adapters/error.js';
import {
  IsInvalidInput,
  IsTargetAlreadyExists,
  IsTargetNotFountError,
  IsUnauthorizedError,
} from '../../domain/error.js';
import type { AppLogger } from '../../services/interfaces/logger.interface.js';
import { LOGGER } from '../../services/interfaces/tokens.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER) private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const value = (exceptionResponse as { message?: unknown }).message;
        if (typeof value === 'string') {
          message = value;
        } else if (Array.isArray(value)) {
          message = value.join(', ');
        }
      }
    } else if (exception instanceof Error && IsUnauthorizedError(exception)) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof Error && IsTargetNotFountError(exception)) {
      statusCode = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof Error && IsInvalidInput(exception)) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof Error && IsTargetAlreadyExists(exception)) {
      statusCode = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof Error && IsAdapterServerError(exception)) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else if (
      exception instanceof Error &&
      IsAdapterInvariantError(exception)
    ) {
      statusCode = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error(exception.message);
        this.logger.debug(exception.stack ?? '');
      } else {
        this.logger.error('Unknown non-error exception');
      }
    }

    response.status(statusCode).json({
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
