import { Recipe } from '../../../domain/recipe.js';

export interface RecipeRepository {
  getById(id: string): Promise<Recipe | null>;
  getByUserId(userId: string, isPublic?: boolean): Promise<Recipe[]>;
  create(data: Recipe): Promise<void>;
  update(data: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
}
