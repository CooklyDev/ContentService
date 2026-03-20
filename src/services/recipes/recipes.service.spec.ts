import { Test, TestingModule } from '@nestjs/testing';

import { BusinessError } from '../../domain/error';
import { Recipe } from '../../domain/recipe';
import { RecipesService } from './recipes.service';
import { ID_PROVIDER, RECIPE_REPOSITORY } from '../interfaces/tokens';

describe('RecipesService', () => {
  let service: RecipesService;
  let idProvider: { getUserId: jest.Mock<string, []> };
  let recipeRepository: {
    create: jest.Mock<Promise<void>, [unknown]>;
    getById: jest.Mock<Promise<Recipe | null>, [string]>;
    update: jest.Mock<Promise<void>, [Recipe]>;
    delete: jest.Mock<Promise<void>, [string]>;
  };

  beforeEach(async () => {
    idProvider = {
      getUserId: jest.fn<string, []>(),
    };
    recipeRepository = {
      create: jest.fn<Promise<void>, [unknown]>(),
      getById: jest.fn<Promise<Recipe | null>, [string]>(),
      update: jest.fn<Promise<void>, [Recipe]>(),
      delete: jest.fn<Promise<void>, [string]>(),
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
    idProvider.getUserId.mockReturnValue('session-id');
    recipeRepository.create.mockResolvedValue();

    // Act
    await service.create({
      userId: 'ignored-user-id',
      name: 'Recipe name',
      description: 'Description',
      instructions: 'Instructions',
    });

    // Assert
    expect(recipeRepository.create).toHaveBeenCalledWith({
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
    idProvider.getUserId.mockReturnValue('session-id');
    recipeRepository.getById.mockResolvedValue(recipe);
    recipeRepository.update.mockResolvedValue();

    // Act
    await service.update({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'New name',
      description: 'New description',
      instructions: 'New instructions',
    });

    // Assert
    expect(recipeRepository.update).toHaveBeenCalledWith(recipe);
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
    idProvider.getUserId.mockReturnValue('session-id');
    recipeRepository.getById.mockResolvedValue(recipe);

    // Act
    const action = service.delete('22222222-2222-4222-8222-222222222222');

    // Assert
    await expect(action).rejects.toThrow(BusinessError);
    expect(recipeRepository.delete).not.toHaveBeenCalled();
  });
});
