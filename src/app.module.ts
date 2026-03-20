import { Module } from '@nestjs/common';

import { RecipesService } from './services/recipes/recipes.service';
import { StubIdProvider } from './adapters/id_provider';
import { RecipesController } from './controllers/recipes.controller';
import { ID_PROVIDER, RECIPE_REPOSITORY } from './services/interfaces/tokens';
import { PrismaRecipeRepository } from './adapters/repo/prisma/recipe.repo';
import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaModule } from './adapters/client';

@Module({
  imports: [PrismaModule],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: PrismaClient,
      useFactory: () => new PrismaClient(),
    },
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
