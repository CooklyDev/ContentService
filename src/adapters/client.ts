import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { AdapterServerError } from './error.js';
import {
  PrismaClientProvider,
  PrismaTransactionContext,
} from './repo/prisma/prisma-client.provider.js';
import { PrismaTransactionManager } from './transaction-manager.js';

@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new AdapterServerError('DATABASE_URL is not set');
        }

        return new PrismaClient({
          adapter: new PrismaPg({ connectionString }),
        });
      },
    },
    PrismaTransactionContext,
    PrismaClientProvider,
    PrismaTransactionManager,
  ],
  exports: [
    PrismaClient,
    PrismaTransactionContext,
    PrismaClientProvider,
    PrismaTransactionManager,
  ],
})
export class PrismaModule {}
