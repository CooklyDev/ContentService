import { Collection } from '../../../domain/collection.js';
import { Recipe } from '../../../domain/recipe.js';

export type CollectionRow = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  recipes: {
    recipeId: string;
  }[];
};

export const collectionSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  recipes: {
    select: {
      recipeId: true,
    },
  },
} as const;

export const toDomain = (row: CollectionRow, recipes: Recipe[]): Collection => {
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  const collectionRecipes = row.recipes
    .map((r) => recipeMap.get(r.recipeId))
    .filter((r): r is Recipe => r !== undefined);

  return new Collection(
    row.id,
    row.userId,
    row.name,
    row.description,
    collectionRecipes,
  );
};

export const toPersistence = (
  entity: Collection,
): Omit<CollectionRow, 'id' | 'recipes'> => ({
  userId: entity.userId,
  name: entity.name,
  description: entity.description,
});
