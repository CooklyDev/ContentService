import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import {
  recipeSelect,
  type RecipeRow,
  toDomain,
  toPersistence,
} from './recipe.mappers.js';
import { Recipe } from '../../../domain/recipe.js';
import { CreateRecipeDto } from '../../../services/dto.js';
import { RecipeRepository } from '../../../services/interfaces/repos/recipes.interface.js';

@Injectable()
export class PrismaRecipeRepository implements RecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getById(id: string): Promise<Recipe | null> {
    const recipe = (await this.prisma.recipe.findUnique({
      where: { id: id },
      select: recipeSelect,
    })) as RecipeRow | null;

    return recipe ? toDomain(recipe) : null;
  }

  async getByUserId(userId: string): Promise<Recipe[]> {
    const recipes = (await this.prisma.recipe.findMany({
      where: { userId: userId },
      select: recipeSelect,
    })) as RecipeRow[];

    return recipes.map(toDomain);
  }

  async create(data: CreateRecipeDto): Promise<void> {
    await this.prisma.recipe.create({
      data: data,
    });
  }
  async update(data: Recipe): Promise<void> {
    await this.prisma.recipe.update({
      where: { id: data.id },
      data: toPersistence(data),
    });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.recipe.delete({
      where: { id: id },
    });
  }
}
