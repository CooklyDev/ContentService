import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../prisma/generated/prisma/client';
import {
  recipeSelect,
  type RecipeRow,
  toDomain,
  toPersistence,
} from './recipe.mappers';
import { Recipe } from 'src/domain/recipe';
import { CreateRecipeDto } from 'src/services/dto';
import { RecipeRepository } from 'src/services/interfaces/repos/recipes.interface';

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
