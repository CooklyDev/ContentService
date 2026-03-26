import { Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { AdapterServerError } from './error.js';

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
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
