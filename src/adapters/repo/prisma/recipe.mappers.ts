import { Recipe } from '../../../domain/recipe.js';

export type RecipeRow = {
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
};

export const recipeSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  instructions: true,
  calories: true,
  proteins: true,
  carbohydrates: true,
  preparationTime: true,
  cookTime: true,
  complexity: true,
} as const;

export const toDomain = (row: RecipeRow): Recipe =>
  new Recipe(
    row.id,
    row.userId,
    row.name,
    row.description,
    row.instructions,
    row.calories,
    row.proteins,
    row.carbohydrates,
    row.preparationTime,
    row.cookTime,
    row.complexity,
  );

export const toPersistence = (entity: Recipe): Omit<RecipeRow, 'id'> => ({
  userId: entity.userId,
  name: entity.name,
  description: entity.description,
  instructions: entity.instructions,
  calories: entity.calories,
  proteins: entity.proteins,
  carbohydrates: entity.carbohydrates,
  preparationTime: entity.preparationTime,
  cookTime: entity.cookTime,
  complexity: entity.complexity,
});
