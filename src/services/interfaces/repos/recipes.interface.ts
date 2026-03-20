import { Recipe } from '../../../domain/recipe';
import { CreateRecipeDto } from '../../dto';

export interface RecipeRepository {
  getById(id: string): Promise<Recipe | null>;
  create(data: CreateRecipeDto): Promise<void>;
  update(data: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
}
