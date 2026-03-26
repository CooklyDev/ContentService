import { Collection } from '../../../domain/collection.js';

export interface CollectionRepository {
  getById(id: string): Promise<Collection | null>;
  getByUserId(userId: string): Promise<Collection[]>;
  create(data: Collection): Promise<void>;
  update(data: Collection): Promise<void>;
  delete(id: string): Promise<void>;
  addRecipeToCollection(collectionId: string, recipeId: string): Promise<void>;
  removeRecipeFromCollection(
    collectionId: string,
    recipeId: string,
  ): Promise<void>;
}
