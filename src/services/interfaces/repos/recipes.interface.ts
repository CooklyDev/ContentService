import { Recipe } from '../../../domain/recipe.js';
import { CreateRecipeDto } from '../../dto.js';

export interface RecipeRepository {
  getById(id: string): Promise<Recipe | null>;
  create(data: CreateRecipeDto): Promise<void>;
  update(data: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
}
