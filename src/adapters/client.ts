import { Module, Scope } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/prisma/client';

@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        return new PrismaClient(); // Создание нового экземпляра PrismaClient
      },
      scope: Scope.REQUEST, // Новый экземпляр для каждого запроса
    },
  ],
  exports: [PrismaClient], // Экспорт для использования в других модулях
})
export class PrismaModule {}
