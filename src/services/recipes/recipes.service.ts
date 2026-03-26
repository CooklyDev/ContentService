import { Inject, Injectable } from '@nestjs/common';

import { v4, validate as validateUuid } from 'uuid';

import {
  InvalidInput,
  TargetNotFountError,
  UnauthorizedError,
} from '../../domain/error.js';
import { Recipe } from '../../domain/recipe.js';
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

  private async getCurrentUserId(): Promise<string> {
    const userId = await this.idProvider.getUserId();

    if (!userId) {
      throw new UnauthorizedError();
    }

    return userId;
  }

  private validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new InvalidInput('id');
    }

    if (!validateUuid(id)) {
      throw new InvalidInput('id', 'Invalid id format');
    }
  }

  private validateName(name: string): void {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new InvalidInput('name', 'Invalid recipe name');
    }
  }

  private validateInstructions(instructions: string): void {
    if (typeof instructions !== 'string' || instructions.trim().length === 0) {
      throw new InvalidInput('instructions', 'Invalid recipe instructions');
    }
  }

  async create(data: CreateRecipeDto) {
    this.validateName(data.name);
    this.validateInstructions(data.instructions);
    const userId = await this.getCurrentUserId();
    const recipeId = v4();
    const recipe = new Recipe(
      recipeId,
      userId,
      data.name,
      data.description,
      data.instructions,
    );

    await this.recipeRepository.create(recipe);
  }

  async getByUserId() {
    const userId = await this.getCurrentUserId();
    return this.recipeRepository.getByUserId(userId);
  }

  async getById(id: string) {
    this.validateId(id);
    const userId = await this.getCurrentUserId();
    const recipe = await this.recipeRepository.getById(id);

    if (!recipe) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }
    if (recipe.userId !== userId) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }

    return recipe;
  }

  async update(data: UpdateRecipeDto) {
    this.validateId(data.id);
    if (data.name !== undefined) {
      this.validateName(data.name);
    }
    if (data.instructions !== undefined) {
      this.validateInstructions(data.instructions);
    }
    const userId = await this.getCurrentUserId();

    const currentRecipe = await this.recipeRepository.getById(data.id);
    if (!currentRecipe) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }
    if (currentRecipe.userId !== userId) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }

    currentRecipe.update(data.name, data.description, data.instructions);

    await this.recipeRepository.update(currentRecipe);
  }
  async delete(id: string) {
    this.validateId(id);
    const userId = await this.getCurrentUserId();

    const currentRecipe = await this.recipeRepository.getById(id);
    if (!currentRecipe) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }
    if (currentRecipe.userId !== userId) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }

    await this.recipeRepository.delete(currentRecipe.id);
  }
}
