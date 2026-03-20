import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { BusinessError } from '../../domain/error';
import { Recipe } from '../../domain/recipe';
import { RecipesService } from './recipes.service';
import { ID_PROVIDER, RECIPE_REPOSITORY } from '../interfaces/tokens';

describe('RecipesService', () => {
  let service: RecipesService;
  let getUserIdMock: jest.Mock<() => string>;
  let createMock: jest.Mock<(data: unknown) => Promise<void>>;
  let getByIdMock: jest.Mock<(id: string) => Promise<Recipe | null>>;
  let updateMock: jest.Mock<(recipe: Recipe) => Promise<void>>;
  let deleteMock: jest.Mock<(id: string) => Promise<void>>;
  let idProvider: { getUserId: () => string };
  let recipeRepository: {
    create: (data: unknown) => Promise<void>;
    getById: (id: string) => Promise<Recipe | null>;
    update: (recipe: Recipe) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };

  beforeEach(async () => {
    getUserIdMock = jest.fn<() => string>();
    createMock = jest.fn<(data: unknown) => Promise<void>>();
    getByIdMock = jest.fn<(id: string) => Promise<Recipe | null>>();
    updateMock = jest.fn<(recipe: Recipe) => Promise<void>>();
    deleteMock = jest.fn<(id: string) => Promise<void>>();

    idProvider = {
      getUserId: getUserIdMock,
    };
    recipeRepository = {
      create: createMock,
      getById: getByIdMock,
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
    getUserIdMock.mockReturnValue('session-id');
    createMock.mockResolvedValue();

    // Act
    await service.create({
      userId: 'ignored-user-id',
      name: 'Recipe name',
      description: 'Description',
      instructions: 'Instructions',
    });

    // Assert
    expect(createMock).toHaveBeenCalledWith({
      userId: 'session-id',
      name: 'Recipe name',
      description: 'Description',
      instructions: 'Instructions',
    });
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
    getUserIdMock.mockReturnValue('session-id');
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

  it('should throw when deleting recipe of another user', async () => {
    // Arrange
    const recipe = new Recipe(
      '22222222-2222-4222-8222-222222222222',
      'another-user',
      'Recipe name',
      null,
      'Instructions',
    );
    getUserIdMock.mockReturnValue('session-id');
    getByIdMock.mockResolvedValue(recipe);

    // Act
    const action = service.delete('22222222-2222-4222-8222-222222222222');

    // Assert
    await expect(action).rejects.toThrow(BusinessError);
    expect(deleteMock).not.toHaveBeenCalled();
  });
});
