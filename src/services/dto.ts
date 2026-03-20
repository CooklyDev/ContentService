export class CreateRecipeDto {
  userId: string;
  name: string;
  description: string | null;
  instructions: string;
}

export class UpdateRecipeDto {
  id: string;
  name?: string;
  description?: string | null;
  instructions?: string;
}
