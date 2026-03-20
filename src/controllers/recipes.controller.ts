import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateRecipeDto, UpdateRecipeDto } from '../services/dto.js';
import { RecipesService } from '../services/recipes/recipes.service.js';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.recipesService.getByUserId(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.recipesService.getById(id);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Put()
  async update(@Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(updateRecipeDto);
  }

  @Delete()
  async delete(@Body('id') id: string) {
    return this.recipesService.delete(id);
  }
}
