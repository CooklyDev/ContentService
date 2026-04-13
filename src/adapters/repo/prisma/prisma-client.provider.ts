import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

import { PrismaClient } from '../../generated/prisma/client.js';

export type PrismaDbClient = Pick<
  PrismaClient,
  'recipe' | 'collection' | 'collectionRecipe'
>;

@Injectable()
export class PrismaTransactionContext {
  private readonly storage = new AsyncLocalStorage<PrismaDbClient>();

  getCurrentClient(): PrismaDbClient | undefined {
    return this.storage.getStore();
  }

  run<T>(client: PrismaDbClient, operation: () => Promise<T>): Promise<T> {
    return this.storage.run(client, operation);
  }
}

@Injectable()
export class PrismaClientProvider {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  getClient(): PrismaDbClient {
    return this.transactionContext.getCurrentClient() ?? this.prismaClient;
  }
}
