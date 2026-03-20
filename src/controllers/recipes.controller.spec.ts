import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { RecipesService } from '../services/recipes/recipes.service';
import { RecipesController } from './recipes.controller';

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    // Arrange

    // Act

    // Assert
    expect(controller).toBeDefined();
  });
});
