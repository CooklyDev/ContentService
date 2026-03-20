import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { create } from 'domain';
import { CreateRecipeDto, UpdateRecipeDto } from 'src/services/dto';
import { RecipesService } from 'src/services/recipes/recipes.service';

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

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
