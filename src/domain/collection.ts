import { InvalidInput } from './error.js';
import { validate as uuidValidate } from 'uuid';
import { Recipe } from './recipe.js';

export class Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  recipes: Recipe[];

  constructor(
    id: string,
    userId: string,
    name: string,
    description: string | null,
    recipes: Recipe[] = [],
  ) {
    if (!uuidValidate(id)) {
      throw new InvalidInput('collection.id', 'Invalid UUID');
    }
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.recipes = recipes;
  }

  addRecipe(recipe: Recipe): void {
    if (!this.recipes.find((r) => r.id === recipe.id)) {
      this.recipes.push(recipe);
    }
  }

  removeRecipe(recipeId: string): void {
    this.recipes = this.recipes.filter((r) => r.id !== recipeId);
  }

  update(name?: string, description?: string | null): void {
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
  }
}
