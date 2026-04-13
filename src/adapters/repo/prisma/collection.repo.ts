import { Injectable } from '@nestjs/common';
import {
  collectionSelect,
  type CollectionRow,
  toDomain,
  toPersistence,
} from './collection.mappers.js';
import { Collection } from '../../../domain/collection.js';
import { Recipe } from '../../../domain/recipe.js';
import { CollectionRepository } from '../../../services/interfaces/repos/collections.interface.js';
import {
  recipeSelect,
  type RecipeRow,
  toDomain as recipeToDomain,
} from './recipe.mappers.js';
import { PrismaClientProvider } from './prisma-client.provider.js';

@Injectable()
export class PrismaCollectionRepository implements CollectionRepository {
  constructor(private readonly prismaClientProvider: PrismaClientProvider) {}

  async getById(id: string): Promise<Collection | null> {
    const collection = (await this.prismaClientProvider
      .getClient()
      .collection.findUnique({
        where: { id: id },
        select: collectionSelect,
      })) as CollectionRow | null;

    if (!collection) {
      return null;
    }

    const recipes = await this.getRecipesForCollection(
      collection.recipes.map((r) => r.recipeId),
    );

    return toDomain(collection, recipes);
  }

  async getByUserId(userId: string): Promise<Collection[]> {
    const collections = (await this.prismaClientProvider
      .getClient()
      .collection.findMany({
        where: { userId: userId },
        select: collectionSelect,
      })) as CollectionRow[];

    const allRecipeIds = [
      ...new Set(collections.flatMap((c) => c.recipes.map((r) => r.recipeId))),
    ];

    const recipes = await this.getRecipesForCollection(allRecipeIds);

    return collections.map((c) => toDomain(c, recipes));
  }

  async create(data: Collection): Promise<void> {
    await this.prismaClientProvider.getClient().collection.create({
      data: {
        id: data.id,
        ...toPersistence(data),
      },
    });
  }

  async update(data: Collection): Promise<void> {
    await this.prismaClientProvider.getClient().collection.update({
      where: { id: data.id },
      data: toPersistence(data),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaClientProvider.getClient().collection.delete({
      where: { id: id },
    });
  }

  async removeRecipeFromForeignCollections(
    recipeId: string,
    ownerId: string,
  ): Promise<void> {
    await this.prismaClientProvider.getClient().collectionRecipe.deleteMany({
      where: {
        recipeId,
        collection: {
          userId: {
            not: ownerId,
          },
        },
      },
    });
  }

  async addRecipeToCollection(
    collectionId: string,
    recipeId: string,
  ): Promise<void> {
    await this.prismaClientProvider.getClient().collectionRecipe.create({
      data: {
        collectionId,
        recipeId,
      },
    });
  }

  async removeRecipeFromCollection(
    collectionId: string,
    recipeId: string,
  ): Promise<void> {
    await this.prismaClientProvider.getClient().collectionRecipe.delete({
      where: {
        collectionId_recipeId: {
          collectionId,
          recipeId,
        },
      },
    });
  }

  private async getRecipesForCollection(
    recipeIds: string[],
  ): Promise<Recipe[]> {
    if (recipeIds.length === 0) {
      return [];
    }

    const recipes = (await this.prismaClientProvider
      .getClient()
      .recipe.findMany({
        where: { id: { in: recipeIds } },
        select: recipeSelect,
      })) as RecipeRow[];

    return recipes.map(recipeToDomain);
  }
}
