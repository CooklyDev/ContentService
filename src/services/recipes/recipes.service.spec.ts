import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import {
  InvalidInput,
  TargetNotFountError,
  UnauthorizedError,
} from '../../domain/error.js';
import { Recipe } from '../../domain/recipe.js';
import { RecipesService } from './recipes.service.js';
import { ID_PROVIDER, RECIPE_REPOSITORY } from '../interfaces/tokens.js';

describe('RecipesService', () => {
  let service: RecipesService;
  let getUserIdMock: jest.Mock<() => Promise<string | null>>;
  let createMock: jest.Mock<(data: unknown) => Promise<void>>;
  let getByIdMock: jest.Mock<(id: string) => Promise<Recipe | null>>;
  let getByUserIdMock: jest.Mock<(userId: string) => Promise<Recipe[]>>;
  let updateMock: jest.Mock<(recipe: Recipe) => Promise<void>>;
  let deleteMock: jest.Mock<(id: string) => Promise<void>>;
  let idProvider: { getUserId: () => Promise<string | null> };
  let recipeRepository: {
    create: (data: unknown) => Promise<void>;
    getById: (id: string) => Promise<Recipe | null>;
    getByUserId: (userId: string) => Promise<Recipe[]>;
    update: (recipe: Recipe) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };

  beforeEach(async () => {
    getUserIdMock = jest.fn<() => Promise<string | null>>();
    createMock = jest.fn<(data: unknown) => Promise<void>>();
    getByIdMock = jest.fn<(id: string) => Promise<Recipe | null>>();
    getByUserIdMock = jest.fn<(userId: string) => Promise<Recipe[]>>();
    updateMock = jest.fn<(recipe: Recipe) => Promise<void>>();
    deleteMock = jest.fn<(id: string) => Promise<void>>();

    idProvider = {
      getUserId: getUserIdMock,
    };
    recipeRepository = {
      create: createMock,
      getById: getByIdMock,
      getByUserId: getByUserIdMock,
      update: updateMock,
      delete: deleteMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: ID_PROVIDER,
          useValue: idProvider,
        },
        {
          provide: RECIPE_REPOSITORY,
          useValue: recipeRepository,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    // Arrange

    // Act

    // Assert
    expect(service).toBeDefined();
  });

  it('should create recipe with user id from id provider', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue('session-id');
    createMock.mockResolvedValue();

    // Act
    await service.create({
      name: 'Recipe name',
      description: 'Description',
      instructions: 'Instructions',
    });

    // Assert
    expect(createMock).toHaveBeenCalledTimes(1);

    const createdRecipe = createMock.mock.calls[0]?.[0] as Recipe;
    expect(createdRecipe).toBeInstanceOf(Recipe);
    expect(createdRecipe.userId).toBe('session-id');
    expect(createdRecipe.name).toBe('Recipe name');
    expect(createdRecipe.description).toBe('Description');
    expect(createdRecipe.instructions).toBe('Instructions');
  });

  it('should update recipe when current user owns it', async () => {
    // Arrange
    const recipe = new Recipe(
      '11111111-1111-4111-8111-111111111111',
      'session-id',
      'Old name',
      'Old description',
      'Old instructions',
    );
    getUserIdMock.mockResolvedValue('session-id');
    getByIdMock.mockResolvedValue(recipe);
    updateMock.mockResolvedValue();

    // Act
    await service.update({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'New name',
      description: 'New description',
      instructions: 'New instructions',
    });

    // Assert
    expect(updateMock).toHaveBeenCalledWith(recipe);
    expect(recipe.name).toBe('New name');
    expect(recipe.description).toBe('New description');
    expect(recipe.instructions).toBe('New instructions');
  });

  it('should return recipes by user id', async () => {
    // Arrange
    const recipes = [
      new Recipe(
        '33333333-3333-4333-8333-333333333333',
        'target-user',
        'Recipe one',
        null,
        'Instructions one',
      ),
      new Recipe(
        '44444444-4444-4444-8444-444444444444',
        'target-user',
        'Recipe two',
        'Description',
        'Instructions two',
      ),
    ];
    getUserIdMock.mockResolvedValue('target-user');
    getByUserIdMock.mockResolvedValue(recipes);

    // Act
    const result = await service.getByUserId();

    // Assert
    expect(getByUserIdMock).toHaveBeenCalledWith('target-user');
    expect(result).toEqual(recipes);
  });

  it('should return recipe by id when current user owns it', async () => {
    // Arrange
    const recipe = new Recipe(
      '55555555-5555-4555-8555-555555555555',
      'session-id',
      'Recipe name',
      null,
      'Instructions',
    );
    getUserIdMock.mockResolvedValue('session-id');
    getByIdMock.mockResolvedValue(recipe);

    // Act
    const result = await service.getById(
      '55555555-5555-4555-8555-555555555555',
    );

    // Assert
    expect(getByIdMock).toHaveBeenCalledWith(
      '55555555-5555-4555-8555-555555555555',
    );
    expect(result).toBe(recipe);
  });

  it('should throw when getting recipe by id of another user', async () => {
    // Arrange
    const recipe = new Recipe(
      '66666666-6666-4666-8666-666666666666',
      'another-user',
      'Recipe name',
      null,
      'Instructions',
    );
    getUserIdMock.mockResolvedValue('session-id');
    getByIdMock.mockResolvedValue(recipe);

    // Act
    const action = service.getById('66666666-6666-4666-8666-666666666666');

    // Assert
    await expect(action).rejects.toThrow(TargetNotFountError);
  });

  it('should throw when deleting recipe of another user', async () => {
    // Arrange
    const recipe = new Recipe(
      '22222222-2222-4222-8222-222222222222',
      'another-user',
      'Recipe name',
      null,
      'Instructions',
    );
    getUserIdMock.mockResolvedValue('session-id');
    getByIdMock.mockResolvedValue(recipe);

    // Act
    const action = service.delete('22222222-2222-4222-8222-222222222222');

    // Assert
    await expect(action).rejects.toThrow(TargetNotFountError);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should throw when user id cannot be resolved', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue(null);

    // Act
    const action = service.getByUserId();

    // Assert
    await expect(action).rejects.toThrow(UnauthorizedError);
    expect(getByUserIdMock).not.toHaveBeenCalled();
  });

  it('should throw when id format is invalid', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue('session-id');

    // Act
    const action = service.getById('invalid-id');

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });

  it('should throw when id is empty', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue('session-id');

    // Act
    const action = service.getById('');

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });

  it('should throw when delete with invalid id format', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue('session-id');

    // Act
    const action = service.delete('invalid-id-format');

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });

  it('should throw when update with invalid id format', async () => {
    // Arrange
    getUserIdMock.mockResolvedValue('session-id');

    // Act
    const action = service.update({
      id: 'not-a-uuid',
      name: 'New name',
    });

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });

  it('should throw when creating recipe with empty name', async () => {
    // Arrange

    // Act
    const action = service.create({
      name: '   ',
      description: null,
      instructions: 'Valid instructions',
    });

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should throw when creating recipe with empty instructions', async () => {
    // Arrange

    // Act
    const action = service.create({
      name: 'Valid name',
      description: null,
      instructions: '   ',
    });

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should throw when updating recipe with empty name', async () => {
    // Arrange

    // Act
    const action = service.update({
      id: '11111111-1111-4111-8111-111111111111',
      name: '   ',
    });

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });

  it('should throw when updating recipe with empty instructions', async () => {
    // Arrange

    // Act
    const action = service.update({
      id: '11111111-1111-4111-8111-111111111111',
      instructions: '   ',
    });

    // Assert
    await expect(action).rejects.toThrow(InvalidInput);
    expect(getByIdMock).not.toHaveBeenCalled();
  });
});
