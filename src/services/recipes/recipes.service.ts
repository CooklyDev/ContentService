import { Inject, Injectable } from '@nestjs/common';

import { BusinessError } from '../../domain/error.js';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto.js';
import type { IdProvider } from '../interfaces/common.js';
import type { RecipeRepository } from '../interfaces/repos/recipes.interface.js';
import { ID_PROVIDER, RECIPE_REPOSITORY } from '../interfaces/tokens.js';

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

  async getByUserId(userId: string) {
    return this.recipeRepository.getByUserId(userId);
  }

  async getById(id: string) {
    const userId = this.idProvider.getUserId();
    const recipe = await this.recipeRepository.getById(id);

    if (!recipe) {
      throw new BusinessError('Recipe not found');
    }
    if (recipe.userId !== userId) {
      throw new BusinessError('Recipe not found');
    }

    return recipe;
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
