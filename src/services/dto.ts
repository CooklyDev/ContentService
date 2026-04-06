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

  @ApiProperty({
    description: 'Calories',
    type: Number,
    required: false,
    nullable: true,
    example: 450,
  })
  calories?: number | null;

  @ApiProperty({
    description: 'Proteins',
    type: Number,
    required: false,
    nullable: true,
    example: 20,
  })
  proteins?: number | null;

  @ApiProperty({
    description: 'Carbohydrates',
    type: Number,
    required: false,
    nullable: true,
    example: 35,
  })
  carbohydrates?: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    type: Number,
    required: false,
    nullable: true,
    example: 15,
  })
  preparationTime?: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    type: Number,
    required: false,
    nullable: true,
    example: 30,
  })
  cookTime?: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    type: Number,
    required: false,
    nullable: true,
    example: 6,
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

  @ApiProperty({
    description: 'Calories',
    type: Number,
    required: false,
    nullable: true,
    example: 450,
  })
  calories?: number | null;

  @ApiProperty({
    description: 'Proteins',
    type: Number,
    required: false,
    nullable: true,
    example: 20,
  })
  proteins?: number | null;

  @ApiProperty({
    description: 'Carbohydrates',
    type: Number,
    required: false,
    nullable: true,
    example: 35,
  })
  carbohydrates?: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    type: Number,
    required: false,
    nullable: true,
    example: 15,
  })
  preparationTime?: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    type: Number,
    required: false,
    nullable: true,
    example: 30,
  })
  cookTime?: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    type: Number,
    required: false,
    nullable: true,
    example: 6,
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

  @ApiProperty({
    description: 'Calories',
    type: Number,
    nullable: true,
    example: 450,
  })
  calories!: number | null;

  @ApiProperty({
    description: 'Proteins',
    type: Number,
    nullable: true,
    example: 20,
  })
  proteins!: number | null;

  @ApiProperty({
    description: 'Carbohydrates',
    type: Number,
    nullable: true,
    example: 35,
  })
  carbohydrates!: number | null;

  @ApiProperty({
    description: 'Preparation time in minutes',
    type: Number,
    nullable: true,
    example: 15,
  })
  preparationTime!: number | null;

  @ApiProperty({
    description: 'Cook time in minutes',
    type: Number,
    nullable: true,
    example: 30,
  })
  cookTime!: number | null;

  @ApiProperty({
    description: 'Recipe complexity from 1 to 10',
    type: Number,
    nullable: true,
    example: 6,
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
