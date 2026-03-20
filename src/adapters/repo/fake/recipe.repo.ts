import { Injectable } from '@nestjs/common';

import { RecipeRepository } from '../../../services/interfaces/repos/recipes.interface';

@Injectable()
export class StubRecipeRepository implements RecipeRepository {
  getById(): Promise<null> {
    return Promise.resolve(null);
  }

  create(): Promise<void> {
    return Promise.resolve();
  }

  update(): Promise<void> {
    return Promise.resolve();
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }
}
