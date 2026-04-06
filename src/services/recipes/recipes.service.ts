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
import type { CollectionRepository } from '../interfaces/repos/collections.interface.js';
import type { RecipeRepository } from '../interfaces/repos/recipes.interface.js';
import {
  COLLECTION_REPOSITORY,
  ID_PROVIDER,
  RECIPE_REPOSITORY,
} from '../interfaces/tokens.js';

@Injectable()
export class RecipesService {
  constructor(
    @Inject(ID_PROVIDER) private readonly idProvider: IdProvider,
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: RecipeRepository,
    @Inject(COLLECTION_REPOSITORY)
    private readonly collectionRepository: CollectionRepository,
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

  private validateDescription(description: string | null | undefined): void {
    if (description === undefined || description === null) {
      return;
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      throw new InvalidInput('description', 'Invalid recipe description');
    }
  }

  private validateOptionalIntegerField(
    field: string,
    value: number | null | undefined,
  ): void {
    if (value === undefined || value === null) {
      return;
    }

    if (!Number.isInteger(value) || value < 0) {
      throw new InvalidInput(field, `Invalid ${field}`);
    }
  }

  private validateComplexity(complexity: number | null | undefined): void {
    if (complexity === undefined || complexity === null) {
      return;
    }

    if (!Number.isInteger(complexity) || complexity < 1 || complexity > 10) {
      throw new InvalidInput(
        'complexity',
        'Complexity must be an integer from 1 to 10',
      );
    }
  }

  private validateIsPublic(isPublic: boolean | undefined): void {
    if (isPublic === undefined) {
      return;
    }

    if (typeof isPublic !== 'boolean') {
      throw new InvalidInput('isPublic', 'Invalid recipe visibility flag');
    }
  }

  async create(data: CreateRecipeDto) {
    this.validateName(data.name);
    this.validateDescription(data.description);
    this.validateInstructions(data.instructions);
    this.validateOptionalIntegerField('calories', data.calories);
    this.validateOptionalIntegerField('proteins', data.proteins);
    this.validateOptionalIntegerField('carbohydrates', data.carbohydrates);
    this.validateOptionalIntegerField('preparationTime', data.preparationTime);
    this.validateOptionalIntegerField('cookTime', data.cookTime);
    this.validateComplexity(data.complexity);
    this.validateIsPublic(data.isPublic);
    const userId = await this.getCurrentUserId();
    const recipeId = v4();
    const recipe = new Recipe(
      recipeId,
      userId,
      data.name,
      data.description,
      data.instructions,
      data.calories ?? null,
      data.proteins ?? null,
      data.carbohydrates ?? null,
      data.preparationTime ?? null,
      data.cookTime ?? null,
      data.complexity ?? null,
      data.isPublic ?? false,
    );

    await this.recipeRepository.create(recipe);
  }

  async getByUserId(targetUserId?: string) {
    const currentUserId = await this.getCurrentUserId();
    const userId = targetUserId ?? currentUserId;
    const isForeignUser = userId !== currentUserId;

    return this.recipeRepository.getByUserId(
      userId,
      isForeignUser ? true : undefined,
    );
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
    if (data.description !== undefined) {
      this.validateDescription(data.description);
    }
    if (data.instructions !== undefined) {
      this.validateInstructions(data.instructions);
    }
    if (data.calories !== undefined) {
      this.validateOptionalIntegerField('calories', data.calories);
    }
    if (data.proteins !== undefined) {
      this.validateOptionalIntegerField('proteins', data.proteins);
    }
    if (data.carbohydrates !== undefined) {
      this.validateOptionalIntegerField('carbohydrates', data.carbohydrates);
    }
    if (data.preparationTime !== undefined) {
      this.validateOptionalIntegerField(
        'preparationTime',
        data.preparationTime,
      );
    }
    if (data.cookTime !== undefined) {
      this.validateOptionalIntegerField('cookTime', data.cookTime);
    }
    if (data.complexity !== undefined) {
      this.validateComplexity(data.complexity);
    }
    if (data.isPublic !== undefined) {
      this.validateIsPublic(data.isPublic);
    }
    const userId = await this.getCurrentUserId();

    const currentRecipe = await this.recipeRepository.getById(data.id);
    if (!currentRecipe) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }
    if (currentRecipe.userId !== userId) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }

    const becamePrivate =
      currentRecipe.isPublic === true && data.isPublic === false;

    currentRecipe.update(
      data.name,
      data.description,
      data.instructions,
      data.calories,
      data.proteins,
      data.carbohydrates,
      data.preparationTime,
      data.cookTime,
      data.complexity,
      data.isPublic,
    );

    await this.recipeRepository.update(currentRecipe);

    if (becamePrivate) {
      await this.collectionRepository.removeRecipeFromForeignCollections(
        currentRecipe.id,
        userId,
      );
    }
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
