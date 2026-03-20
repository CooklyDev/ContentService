import { BusinessError } from './error.js';
import { validate as uuidValidate } from 'uuid';

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
    if (!uuidValidate(id)) {
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
