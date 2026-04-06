import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({ description: 'Recipe name' })
  name!: string;

  @ApiProperty({
    description: 'Optional recipe description',
    type: String,
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ description: 'Cooking instructions' })
  instructions!: string;

  @ApiProperty({ description: 'Calories', required: false, nullable: true })
  calories?: number | null;

  @ApiProperty({ description: 'Proteins', required: false, nullable: true })
  proteins?: number | null;

  @ApiProperty({
    description: 'Carbohydrates',
    required: false,
    nullable: true,
  })
  carbohydrates?: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    required: false,
    nullable: true,
  })
  preparationTime?: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    required: false,
    nullable: true,
  })
  cookTime?: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    required: false,
    nullable: true,
  })
  complexity?: number | null;
}

export class UpdateRecipeDto {
  @ApiProperty({ description: 'Recipe ID' })
  id!: string;

  @ApiProperty({ description: 'Recipe name', required: false })
  name?: string;

  @ApiProperty({
    description: 'Optional recipe description',
    type: String,
    nullable: true,
    required: false,
  })
  description?: string | null;

  @ApiProperty({ description: 'Cooking instructions', required: false })
  instructions?: string;

  @ApiProperty({ description: 'Calories', required: false, nullable: true })
  calories?: number | null;

  @ApiProperty({ description: 'Proteins', required: false, nullable: true })
  proteins?: number | null;

  @ApiProperty({
    description: 'Carbohydrates',
    required: false,
    nullable: true,
  })
  carbohydrates?: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    required: false,
    nullable: true,
  })
  preparationTime?: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    required: false,
    nullable: true,
  })
  cookTime?: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    required: false,
    nullable: true,
  })
  complexity?: number | null;
}

export class CreateCollectionDto {
  @ApiProperty({ description: 'Collection name' })
  name!: string;

  @ApiProperty({
    description: 'Optional collection description',
    type: String,
    nullable: true,
  })
  description!: string | null;
}

export class UpdateCollectionDto {
  @ApiProperty({ description: 'Collection ID' })
  id!: string;

  @ApiProperty({ description: 'Collection name', required: false })
  name?: string;

  @ApiProperty({
    description: 'Optional collection description',
    type: String,
    nullable: true,
    required: false,
  })
  description?: string | null;
}

export class AddRecipeToCollectionDto {
  @ApiProperty({ description: 'Collection ID' })
  collectionId!: string;

  @ApiProperty({ description: 'Recipe ID' })
  recipeId!: string;
}

export class RemoveRecipeFromCollectionDto {
  @ApiProperty({ description: 'Collection ID' })
  collectionId!: string;

  @ApiProperty({ description: 'Recipe ID' })
  recipeId!: string;
}

export class RecipeResponseDto {
  @ApiProperty({ description: 'Recipe ID' })
  id!: string;

  @ApiProperty({ description: 'Recipe author ID' })
  userId!: string;

  @ApiProperty({ description: 'Recipe name' })
  name!: string;

  @ApiProperty({
    description: 'Optional recipe description',
    type: String,
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ description: 'Cooking instructions' })
  instructions!: string;

  @ApiProperty({ description: 'Calories', nullable: true })
  calories!: number | null;

  @ApiProperty({ description: 'Proteins', nullable: true })
  proteins!: number | null;

  @ApiProperty({ description: 'Carbohydrates', nullable: true })
  carbohydrates!: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    nullable: true,
  })
  preparationTime!: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    nullable: true,
  })
  cookTime!: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    nullable: true,
  })
  complexity!: number | null;
}

export class CollectionResponseDto {
  @ApiProperty({ description: 'Collection ID' })
  id!: string;

  @ApiProperty({ description: 'Collection author ID' })
  userId!: string;

  @ApiProperty({ description: 'Collection name' })
  name!: string;

  @ApiProperty({
    description: 'Optional collection description',
    type: String,
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Recipes in collection',
    type: () => [RecipeResponseDto],
  })
  recipes!: RecipeResponseDto[];
}
