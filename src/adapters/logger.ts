import { Injectable, Logger } from '@nestjs/common';

import type { AppLogger } from '../services/interfaces/logger.interface.js';

@Injectable()
export class NestLoggerAdapter implements AppLogger {
  private readonly logger = new Logger(NestLoggerAdapter.name);

  debug(message: string): void {
    this.logger.debug(message);
  }

  info(message: string): void {
    this.logger.log(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
