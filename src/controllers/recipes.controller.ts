import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';

import {
  CreateRecipeDto,
  RecipeResponseDto,
  UpdateRecipeDto,
} from '../services/dto.js';
import { RecipesService } from '../services/recipes/recipes.service.js';

@ApiTags('recipes')
@ApiSecurity('X-Session-ID')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recipes for current user' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description:
      'Target user ID. For another user only public recipes are returned',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recipes',
    type: RecipeResponseDto,
    isArray: true,
  })
  async getByUserId(@Query('userId') userId?: string) {
    return this.recipesService.getByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe found',
    type: RecipeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  async getById(@Param('id') id: string) {
    return this.recipesService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new recipe' })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({
    status: 201,
    description: 'Recipe created',
  })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update recipe' })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe updated',
  })
  async update(@Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(updateRecipeDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete recipe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Recipe ID' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Recipe deleted',
  })
  async delete(@Body('id') id: string) {
    return this.recipesService.delete(id);
  }
}
