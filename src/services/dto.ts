export class CreateRecipeDto {
  name!: string;
  description!: string | null;
  instructions!: string;
}

export class UpdateRecipeDto {
  id!: string;
  name?: string;
  description?: string | null;
  instructions?: string;
}

export class CreateCollectionDto {
  name!: string;
  description!: string | null;
}

export class UpdateCollectionDto {
  id!: string;
  name?: string;
  description?: string | null;
}

export class AddRecipeToCollectionDto {
  collectionId!: string;
  recipeId!: string;
}

export class RemoveRecipeFromCollectionDto {
  collectionId!: string;
  recipeId!: string;
}
