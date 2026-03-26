import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';

import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddRecipeToCollectionDto,
  RemoveRecipeFromCollectionDto,
} from '../services/dto.js';
import { CollectionsService } from '../services/collections/collections.service.js';

@ApiTags('collections')
@ApiSecurity('X-Session-ID')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all collections for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of collections',
  })
  async getByUserId() {
    return this.collectionsService.getByUserId();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Collection found',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection not found',
  })
  async getById(@Param('id') id: string) {
    return this.collectionsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new collection' })
  @ApiBody({ type: CreateCollectionDto })
  @ApiResponse({
    status: 201,
    description: 'Collection created',
  })
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update collection' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({
    status: 200,
    description: 'Collection updated',
  })
  async update(@Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(updateCollectionDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete collection' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Collection ID' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Collection deleted',
  })
  async delete(@Body('id') id: string) {
    return this.collectionsService.delete(id);
  }

  @Post(':id/recipes')
  @ApiOperation({ summary: 'Add recipe to collection' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiBody({ type: AddRecipeToCollectionDto })
  @ApiResponse({
    status: 201,
    description: 'Recipe added to collection',
  })
  async addRecipe(
    @Param('id') collectionId: string,
    @Body() addRecipeDto: AddRecipeToCollectionDto,
  ) {
    return this.collectionsService.addRecipeToCollection({
      collectionId,
      recipeId: addRecipeDto.recipeId,
    });
  }

  @Delete(':id/recipes/:recipeId')
  @ApiOperation({ summary: 'Remove recipe from collection' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiParam({ name: 'recipeId', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe removed from collection',
  })
  async removeRecipe(
    @Param('id') collectionId: string,
    @Param('recipeId') recipeId: string,
  ) {
    const removeRecipeDto: RemoveRecipeFromCollectionDto = {
      collectionId,
      recipeId,
    };
    return this.collectionsService.removeRecipeFromCollection(removeRecipeDto);
  }
}
