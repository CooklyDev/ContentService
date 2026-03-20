import { Inject, Injectable } from '@nestjs/common';

import { BusinessError } from '../../domain/error';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto';
import type { IdProvider } from '../interfaces/common';
import type { RecipeRepository } from '../interfaces/repos/recipes.interface';
import { ID_PROVIDER, RECIPE_REPOSITORY } from '../interfaces/tokens';

@Injectable()
export class RecipesService {
  constructor(
    @Inject(ID_PROVIDER) private readonly idProvider: IdProvider,
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async create(data: CreateRecipeDto) {
    const userId = this.idProvider.getUserId();

    await this.recipeRepository.create({
      ...data,
      userId: userId,
    });
  }

  async update(data: UpdateRecipeDto) {
    const userId = this.idProvider.getUserId();

    const currentRecipe = await this.recipeRepository.getById(data.id);
    if (!currentRecipe) {
      throw new BusinessError('Recipe not found');
    }
    if (currentRecipe.userId !== userId) {
      throw new BusinessError('Recipe not found');
    }

    currentRecipe.update(data.name, data.description, data.instructions);

    await this.recipeRepository.update(currentRecipe);
  }
  async delete(id: string) {
    const userId = this.idProvider.getUserId();

    const currentRecipe = await this.recipeRepository.getById(id);
    if (!currentRecipe) {
      throw new BusinessError('Recipe not found');
    }
    if (currentRecipe.userId !== userId) {
      throw new BusinessError('Recipe not found');
    }

    await this.recipeRepository.delete(currentRecipe.id);
  }
}
