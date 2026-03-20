import { validate } from 'uuid';
import { BusinessError } from './error';


export class Recipe {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  instructions: string;

  constructor(
    id: string,
    userId: string,
    name: string,
    description: string | null,
    instructions: string,
  ) {
    if (!validate(id)) {
      throw new BusinessError('Invalid UUID');
    }
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.instructions = instructions;
  }

  update(name?: string, description?: string | null, instructions?: string) {
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (instructions !== undefined) {
      this.instructions = instructions;
    }
  }
}
