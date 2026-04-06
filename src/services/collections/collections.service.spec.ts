import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import {
  TargetAlreadyExists,
  TargetNotFountError,
} from '../../domain/error.js';
import { Collection } from '../../domain/collection.js';
import { Recipe } from '../../domain/recipe.js';
import { CollectionsService } from './collections.service.js';
import {
  COLLECTION_REPOSITORY,
  ID_PROVIDER,
  RECIPE_REPOSITORY,
} from '../interfaces/tokens.js';

describe('CollectionsService', () => {
  let service: CollectionsService;
  let getUserIdMock: jest.Mock<() => Promise<string | null>>;
  let getCollectionByIdMock: jest.Mock<
    (id: string) => Promise<Collection | null>
  >;
  let addRecipeToCollectionMock: jest.Mock<
    (collectionId: string, recipeId: string) => Promise<void>
  >;
  let getRecipeByIdMock: jest.Mock<(id: string) => Promise<Recipe | null>>;

  beforeEach(async () => {
    getUserIdMock = jest.fn<() => Promise<string | null>>();
    getCollectionByIdMock =
      jest.fn<(id: string) => Promise<Collection | null>>();
    addRecipeToCollectionMock =
      jest.fn<(collectionId: string, recipeId: string) => Promise<void>>();
    getRecipeByIdMock = jest.fn<(id: string) => Promise<Recipe | null>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: ID_PROVIDER,
          useValue: {
            getUserId: getUserIdMock,
          },
        },
        {
          provide: COLLECTION_REPOSITORY,
          useValue: {
            getById: getCollectionByIdMock,
            addRecipeToCollection: addRecipeToCollectionMock,
            removeRecipeFromCollection: jest.fn(),
            removeRecipeFromForeignCollections: jest.fn(),
            getByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: RECIPE_REPOSITORY,
          useValue: {
            getById: getRecipeByIdMock,
          },
        },
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);
  });

  it('throws TargetAlreadyExists when recipe already exists in collection', async () => {
    // Arrange
    const collectionId = '11111111-1111-4111-8111-111111111111';
    const recipeId = '22222222-2222-4222-8222-222222222222';
    const existingRecipe = new Recipe(
      recipeId,
      'user-id',
      'Recipe name',
      null,
      'Recipe instructions',
    );
    const collection = new Collection(
      collectionId,
      'user-id',
      'Collection name',
      null,
      [existingRecipe],
    );

    getUserIdMock.mockResolvedValue('user-id');
    getCollectionByIdMock.mockResolvedValue(collection);
    getRecipeByIdMock.mockResolvedValue(existingRecipe);

    // Act
    const action = service.addRecipeToCollection({ collectionId, recipeId });

    // Assert
    await expect(action).rejects.toThrow(TargetAlreadyExists);
    expect(addRecipeToCollectionMock).not.toHaveBeenCalled();
  });

  it('adds recipe to collection when recipe is not in collection', async () => {
    // Arrange
    const collectionId = '33333333-3333-4333-8333-333333333333';
    const recipeId = '44444444-4444-4444-8444-444444444444';
    const collection = new Collection(
      collectionId,
      'user-id',
      'Collection name',
      null,
      [],
    );
    const recipe = new Recipe(
      recipeId,
      'user-id',
      'Recipe name',
      null,
      'Recipe instructions',
    );

    getUserIdMock.mockResolvedValue('user-id');
    getCollectionByIdMock.mockResolvedValue(collection);
    getRecipeByIdMock.mockResolvedValue(recipe);
    addRecipeToCollectionMock.mockResolvedValue();

    // Act
    await service.addRecipeToCollection({ collectionId, recipeId });

    // Assert
    expect(addRecipeToCollectionMock).toHaveBeenCalledWith(
      collectionId,
      recipeId,
    );
  });

  it('throws not found error when recipe does not exist', async () => {
    // Arrange
    const collectionId = '55555555-5555-4555-8555-555555555555';
    const recipeId = '66666666-6666-4666-8666-666666666666';
    const collection = new Collection(
      collectionId,
      'user-id',
      'Collection name',
      null,
      [],
    );

    getUserIdMock.mockResolvedValue('user-id');
    getCollectionByIdMock.mockResolvedValue(collection);
    getRecipeByIdMock.mockResolvedValue(null);

    // Act
    const action = service.addRecipeToCollection({ collectionId, recipeId });

    // Assert
    await expect(action).rejects.toThrow(TargetNotFountError);
    expect(addRecipeToCollectionMock).not.toHaveBeenCalled();
  });

  it('adds public recipe of another user to collection', async () => {
    // Arrange
    const collectionId = '77777777-7777-4777-8777-777777777777';
    const recipeId = '88888888-8888-4888-8888-888888888888';
    const collection = new Collection(
      collectionId,
      'user-id',
      'Collection name',
      null,
      [],
    );
    const recipe = new Recipe(
      recipeId,
      'another-user',
      'Recipe name',
      null,
      'Recipe instructions',
      null,
      null,
      null,
      null,
      null,
      null,
      true,
    );

    getUserIdMock.mockResolvedValue('user-id');
    getCollectionByIdMock.mockResolvedValue(collection);
    getRecipeByIdMock.mockResolvedValue(recipe);
    addRecipeToCollectionMock.mockResolvedValue();

    // Act
    await service.addRecipeToCollection({ collectionId, recipeId });

    // Assert
    expect(addRecipeToCollectionMock).toHaveBeenCalledWith(
      collectionId,
      recipeId,
    );
  });

  it('throws not found error when recipe of another user is private', async () => {
    // Arrange
    const collectionId = '99999999-9999-4999-8999-999999999999';
    const recipeId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const collection = new Collection(
      collectionId,
      'user-id',
      'Collection name',
      null,
      [],
    );
    const recipe = new Recipe(
      recipeId,
      'another-user',
      'Recipe name',
      null,
      'Recipe instructions',
    );

    getUserIdMock.mockResolvedValue('user-id');
    getCollectionByIdMock.mockResolvedValue(collection);
    getRecipeByIdMock.mockResolvedValue(recipe);

    // Act
    const action = service.addRecipeToCollection({ collectionId, recipeId });

    // Assert
    await expect(action).rejects.toThrow(TargetNotFountError);
    expect(addRecipeToCollectionMock).not.toHaveBeenCalled();
  });
});
