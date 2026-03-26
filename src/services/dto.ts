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
