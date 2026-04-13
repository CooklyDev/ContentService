import { Injectable } from '@nestjs/common';

import { TransactionManager } from '../services/interfaces/common.js';
import { PrismaClient } from './generated/prisma/client.js';
import {
  PrismaDbClient,
  PrismaTransactionContext,
} from './repo/prisma/prisma-client.provider.js';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  async runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    return this.prismaClient.$transaction((transactionClient) =>
      this.transactionContext.run(
        transactionClient as PrismaDbClient,
        operation,
      ),
    );
  }
}
