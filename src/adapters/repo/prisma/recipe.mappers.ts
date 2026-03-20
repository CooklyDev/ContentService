import { Recipe } from 'src/domain/recipe';

export type RecipeRow = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  instructions: string;
};

export const recipeSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  instructions: true,
} as const;

export const toDomain = (row: RecipeRow): Recipe =>
  new Recipe(row.id, row.userId, row.name, row.description, row.instructions);

export const toPersistence = (entity: Recipe): Omit<RecipeRow, 'id'> => ({
  userId: entity.userId,
  name: entity.name,
  description: entity.description,
  instructions: entity.instructions,
});
