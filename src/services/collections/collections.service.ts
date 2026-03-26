import { Inject, Injectable } from '@nestjs/common';

import { v4, validate as validateUuid } from 'uuid';

import {
  InvalidInput,
  TargetNotFountError,
  UnauthorizedError,
} from '../../domain/error.js';
import { Collection } from '../../domain/collection.js';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddRecipeToCollectionDto,
  RemoveRecipeFromCollectionDto,
} from '../dto.js';
import type { IdProvider } from '../interfaces/common.js';
import type { CollectionRepository } from '../interfaces/repos/collections.interface.js';
import type { RecipeRepository } from '../interfaces/repos/recipes.interface.js';
import {
  ID_PROVIDER,
  COLLECTION_REPOSITORY,
  RECIPE_REPOSITORY,
} from '../interfaces/tokens.js';

@Injectable()
export class CollectionsService {
  constructor(
    @Inject(ID_PROVIDER) private readonly idProvider: IdProvider,
    @Inject(COLLECTION_REPOSITORY)
    private readonly collectionRepository: CollectionRepository,
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: RecipeRepository,
  ) {}

  private async getCurrentUserId(): Promise<string> {
    const userId = await this.idProvider.getUserId();

    if (!userId) {
      throw new UnauthorizedError();
    }

    return userId;
  }

  private validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new InvalidInput('id');
    }

    if (!validateUuid(id)) {
      throw new InvalidInput('id', 'Invalid id format');
    }
  }

  private validateName(name: string): void {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new InvalidInput('name', 'Invalid collection name');
    }
  }

  async create(data: CreateCollectionDto): Promise<void> {
    this.validateName(data.name);
    const userId = await this.getCurrentUserId();
    const collectionId = v4();
    const collection = new Collection(
      collectionId,
      userId,
      data.name,
      data.description,
    );

    await this.collectionRepository.create(collection);
  }

  async getByUserId(): Promise<Collection[]> {
    const userId = await this.getCurrentUserId();
    return this.collectionRepository.getByUserId(userId);
  }

  async getById(id: string): Promise<Collection> {
    this.validateId(id);
    const userId = await this.getCurrentUserId();
    const collection = await this.collectionRepository.getById(id);

    if (!collection) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }
    if (collection.userId !== userId) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }

    return collection;
  }

  async update(data: UpdateCollectionDto): Promise<void> {
    this.validateId(data.id);
    if (data.name !== undefined) {
      this.validateName(data.name);
    }
    const userId = await this.getCurrentUserId();

    const currentCollection = await this.collectionRepository.getById(data.id);
    if (!currentCollection) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }
    if (currentCollection.userId !== userId) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }

    currentCollection.update(data.name, data.description);

    await this.collectionRepository.update(currentCollection);
  }

  async delete(id: string): Promise<void> {
    this.validateId(id);
    const userId = await this.getCurrentUserId();

    const currentCollection = await this.collectionRepository.getById(id);
    if (!currentCollection) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }
    if (currentCollection.userId !== userId) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }

    await this.collectionRepository.delete(currentCollection.id);
  }

  async addRecipeToCollection(data: AddRecipeToCollectionDto): Promise<void> {
    this.validateId(data.collectionId);
    this.validateId(data.recipeId);

    const userId = await this.getCurrentUserId();

    const collection = await this.collectionRepository.getById(
      data.collectionId,
    );
    if (!collection) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }
    if (collection.userId !== userId) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }

    const recipe = await this.recipeRepository.getById(data.recipeId);
    if (!recipe) {
      throw new TargetNotFountError('recipe', 'Recipe not found');
    }

    await this.collectionRepository.addRecipeToCollection(
      data.collectionId,
      data.recipeId,
    );
  }

  async removeRecipeFromCollection(
    data: RemoveRecipeFromCollectionDto,
  ): Promise<void> {
    this.validateId(data.collectionId);
    this.validateId(data.recipeId);

    const userId = await this.getCurrentUserId();

    const collection = await this.collectionRepository.getById(
      data.collectionId,
    );
    if (!collection) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }
    if (collection.userId !== userId) {
      throw new TargetNotFountError('collection', 'Collection not found');
    }

    await this.collectionRepository.removeRecipeFromCollection(
      data.collectionId,
      data.recipeId,
    );
  }
}
