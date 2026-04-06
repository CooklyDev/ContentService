import { InvalidInput } from './error.js';
import { validate as uuidValidate } from 'uuid';

export class Recipe {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  instructions: string;
  calories: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  preparationTime: number | null;
  cookTime: number | null;
  complexity: number | null;

  constructor(
    id: string,
    userId: string,
    name: string,
    description: string | null,
    instructions: string,
    calories: number | null = null,
    proteins: number | null = null,
    carbohydrates: number | null = null,
    preparationTime: number | null = null,
    cookTime: number | null = null,
    complexity: number | null = null,
  ) {
    if (!uuidValidate(id)) {
      throw new InvalidInput('recipe.id', 'Invalid UUID');
    }

    Recipe.validateComplexity(complexity);

    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.instructions = instructions;
    this.calories = calories;
    this.proteins = proteins;
    this.carbohydrates = carbohydrates;
    this.preparationTime = preparationTime;
    this.cookTime = cookTime;
    this.complexity = complexity;
  }

  private static validateComplexity(complexity: number | null): void {
    if (complexity === null) {
      return;
    }

    if (!Number.isInteger(complexity) || complexity < 1 || complexity > 10) {
      throw new InvalidInput(
        'recipe.complexity',
        'Complexity must be an integer from 1 to 10',
      );
    }
  }

  update(
    name?: string,
    description?: string | null,
    instructions?: string,
    calories?: number | null,
    proteins?: number | null,
    carbohydrates?: number | null,
    preparationTime?: number | null,
    cookTime?: number | null,
    complexity?: number | null,
  ) {
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (instructions !== undefined) {
      this.instructions = instructions;
    }
    if (calories !== undefined) {
      this.calories = calories;
    }
    if (proteins !== undefined) {
      this.proteins = proteins;
    }
    if (carbohydrates !== undefined) {
      this.carbohydrates = carbohydrates;
    }
    if (preparationTime !== undefined) {
      this.preparationTime = preparationTime;
    }
    if (cookTime !== undefined) {
      this.cookTime = cookTime;
    }
    if (complexity !== undefined) {
      Recipe.validateComplexity(complexity);
      this.complexity = complexity;
    }
  }
}
