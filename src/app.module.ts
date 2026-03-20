import { Module } from '@nestjs/common';

import { RecipesService } from './services/recipes/recipes.service.js';
import { StubIdProvider } from './adapters/id_provider.js';
import { RecipesController } from './controllers/recipes.controller.js';
import {
  ID_PROVIDER,
  RECIPE_REPOSITORY,
} from './services/interfaces/tokens.js';
import { PrismaRecipeRepository } from './adapters/repo/prisma/recipe.repo.js';
import { PrismaModule } from './adapters/client.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: ID_PROVIDER,
      useClass: StubIdProvider,
    },
    {
      provide: RECIPE_REPOSITORY,
      useClass: PrismaRecipeRepository,
    },
  ],
})
export class AppModule {}
