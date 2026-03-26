import { Module } from '@nestjs/common';

import { RecipesService } from './services/recipes/recipes.service.js';
import { RestIdProvider } from './adapters/id_provider.js';
import { RecipesController } from './controllers/recipes.controller.js';
import {
  ID_PROVIDER,
  LOGGER,
  RECIPE_REPOSITORY,
} from './services/interfaces/tokens.js';
import { PrismaRecipeRepository } from './adapters/repo/prisma/recipe.repo.js';
import { PrismaModule } from './adapters/client.js';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NestLoggerAdapter } from './adapters/logger.js';
import { GlobalExceptionFilter } from './controllers/filters/global-exception.filter.js';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: ID_PROVIDER,
      useClass: RestIdProvider,
    },
    {
      provide: RECIPE_REPOSITORY,
      useClass: PrismaRecipeRepository,
    },
    {
      provide: LOGGER,
      useClass: NestLoggerAdapter,
    },
    GlobalExceptionFilter,
  ],
})
export class AppModule {}
