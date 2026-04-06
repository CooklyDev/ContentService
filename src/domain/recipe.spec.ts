import { describe, expect, it } from '@jest/globals';
import { InvalidInput } from './error.js';
import { Recipe } from './recipe.js';

describe('Recipe', () => {
  it('stores nutrition, timing and complexity fields', () => {
    // Arrange
    const recipe = new Recipe(
      '11111111-1111-4111-8111-111111111111',
      'user-id',
      'Recipe name',
      'Recipe description',
      'Recipe instructions',
      450,
      20,
      35,
      15,
      30,
      7,
    );

    // Act

    // Assert
    expect(recipe.calories).toBe(450);
    expect(recipe.proteins).toBe(20);
    expect(recipe.carbohydrates).toBe(35);
    expect(recipe.preparationTime).toBe(15);
    expect(recipe.cookTime).toBe(30);
    expect(recipe.complexity).toBe(7);
    expect(recipe.isPublic).toBe(false);
  });

  it('sets new fields to null by default', () => {
    // Arrange
    const recipe = new Recipe(
      '22222222-2222-4222-8222-222222222222',
      'user-id',
      'Recipe name',
      null,
      'Recipe instructions',
    );

    // Act

    // Assert
    expect(recipe.calories).toBeNull();
    expect(recipe.proteins).toBeNull();
    expect(recipe.carbohydrates).toBeNull();
    expect(recipe.preparationTime).toBeNull();
    expect(recipe.cookTime).toBeNull();
    expect(recipe.complexity).toBeNull();
    expect(recipe.isPublic).toBe(false);
  });

  it('updates public flag', () => {
    // Arrange
    const recipe = new Recipe(
      '55555555-5555-4555-8555-555555555555',
      'user-id',
      'Recipe name',
      null,
      'Recipe instructions',
    );

    // Act
    recipe.update(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );

    // Assert
    expect(recipe.isPublic).toBe(true);
  });

  it('throws when complexity is outside allowed range', () => {
    // Arrange

    // Act
    const action = () =>
      new Recipe(
        '33333333-3333-4333-8333-333333333333',
        'user-id',
        'Recipe name',
        null,
        'Recipe instructions',
        null,
        null,
        null,
        null,
        null,
        11,
      );

    // Assert
    expect(action).toThrow(InvalidInput);
  });

  it('throws when complexity is not an integer', () => {
    // Arrange
    const recipe = new Recipe(
      '44444444-4444-4444-8444-444444444444',
      'user-id',
      'Recipe name',
      null,
      'Recipe instructions',
    );

    // Act
    const action = () =>
      recipe.update(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        5.5,
      );

    // Assert
    expect(action).toThrow(InvalidInput);
  });
});
