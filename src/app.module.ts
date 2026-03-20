import { Module } from '@nestjs/common';

import { RecipesService } from './services/recipes/recipes.service';
import { StubRecipeRepository } from './adapters/repo/fake/recipe.repo';
import { StubIdProvider } from './adapters/id_provider';
import { RecipesController } from './controllers/recipes.controller';
import { ID_PROVIDER, RECIPE_REPOSITORY } from './services/interfaces/tokens';

@Module({
  imports: [],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    {
      provide: ID_PROVIDER,
      useClass: StubIdProvider,
    },
    {
      provide: RECIPE_REPOSITORY,
      useClass: StubRecipeRepository,
    },
  ],
})
export class AppModule {}
