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
  CreateCollectionDto,
  UpdateCollectionDto,
  AddRecipeToCollectionDto,
  RemoveRecipeFromCollectionDto,
} from '../services/dto.js';
import { CollectionsService } from '../services/collections/collections.service.js';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async getByUserId() {
    return this.collectionsService.getByUserId();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.collectionsService.getById(id);
  }

  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Put()
  async update(@Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(updateCollectionDto);
  }

  @Delete()
  async delete(@Body('id') id: string) {
    return this.collectionsService.delete(id);
  }

  @Post(':id/recipes')
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
