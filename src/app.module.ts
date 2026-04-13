import { Module } from '@nestjs/common';

import { RecipesService } from './services/recipes/recipes.service.js';
import { CollectionsService } from './services/collections/collections.service.js';
import { RestIdProvider } from './adapters/id_provider.js';
import { RecipesController } from './controllers/recipes.controller.js';
import { CollectionsController } from './controllers/collections.controller.js';
import { HealthController } from './controllers/health.controller.js';
import {
  ID_PROVIDER,
  LOGGER,
  RECIPE_REPOSITORY,
  COLLECTION_REPOSITORY,
  TRANSACTION_MANAGER,
} from './services/interfaces/tokens.js';
import { PrismaRecipeRepository } from './adapters/repo/prisma/recipe.repo.js';
import { PrismaCollectionRepository } from './adapters/repo/prisma/collection.repo.js';
import { PrismaModule } from './adapters/client.js';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NestLoggerAdapter } from './adapters/logger.js';
import { GlobalExceptionFilter } from './controllers/filters/global-exception.filter.js';
import { PrismaTransactionManager } from './adapters/transaction-manager.js';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [HealthController, RecipesController, CollectionsController],
  providers: [
    RecipesService,
    CollectionsService,
    {
      provide: ID_PROVIDER,
      useClass: RestIdProvider,
    },
    {
      provide: RECIPE_REPOSITORY,
      useClass: PrismaRecipeRepository,
    },
    {
      provide: COLLECTION_REPOSITORY,
      useClass: PrismaCollectionRepository,
    },
    {
      provide: LOGGER,
      useClass: NestLoggerAdapter,
    },
    {
      provide: TRANSACTION_MANAGER,
      useClass: PrismaTransactionManager,
    },
    GlobalExceptionFilter,
  ],
})
export class AppModule {}
