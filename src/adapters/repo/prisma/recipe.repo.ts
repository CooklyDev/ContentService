import { Injectable } from '@nestjs/common';
import {
  recipeSelect,
  type RecipeRow,
  toDomain,
  toPersistence,
} from './recipe.mappers.js';
import { Recipe } from '../../../domain/recipe.js';
import { RecipeRepository } from '../../../services/interfaces/repos/recipes.interface.js';
import { PrismaClientProvider } from './prisma-client.provider.js';

@Injectable()
export class PrismaRecipeRepository implements RecipeRepository {
  constructor(private readonly prismaClientProvider: PrismaClientProvider) {}

  async getById(id: string): Promise<Recipe | null> {
    const recipe = (await this.prismaClientProvider
      .getClient()
      .recipe.findUnique({
        where: { id: id },
        select: recipeSelect,
      })) as RecipeRow | null;

    return recipe ? toDomain(recipe) : null;
  }

  async getByUserId(userId: string, isPublic?: boolean): Promise<Recipe[]> {
    const recipes = (await this.prismaClientProvider
      .getClient()
      .recipe.findMany({
        where: {
          userId: userId,
          ...(isPublic === undefined ? {} : { public: isPublic }),
        },
        select: recipeSelect,
      })) as RecipeRow[];

    return recipes.map(toDomain);
  }

  async create(data: Recipe): Promise<void> {
    await this.prismaClientProvider.getClient().recipe.create({
      data: {
        id: data.id,
        ...toPersistence(data),
      },
    });
  }
  async update(data: Recipe): Promise<void> {
    await this.prismaClientProvider.getClient().recipe.update({
      where: { id: data.id },
      data: toPersistence(data),
    });
  }
  async delete(id: string): Promise<void> {
    await this.prismaClientProvider.getClient().recipe.delete({
      where: { id: id },
    });
  }
}
