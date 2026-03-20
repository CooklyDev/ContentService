import { Injectable } from '@nestjs/common';

import { RecipeRepository } from '../../../services/interfaces/repos/recipes.interface';

@Injectable()
export class StubRecipeRepository implements RecipeRepository {
  async getById(id: string) {
    return null;
  }
  async create() {}
  async update() {}
  async delete() {}
}
