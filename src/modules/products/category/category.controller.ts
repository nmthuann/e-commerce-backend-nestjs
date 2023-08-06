import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { CategoryDto } from './category-dto/category.dto';
import { ICategoryService } from './category.service.interface';
import { CreateCategoryDto } from './category-dto/create-category.dto';

// working with DTO
@Controller('category') 
export class CategoryController {
    
    constructor(@Inject('ICategoryService')
        private categoryService: ICategoryService
    ) {}

    @Post('create')
    async createCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
        console.log('createCategory')
        return await this.categoryService.createOne(category);
    }


    @Put('update/:category_id')
    async updateCategoryById(@Param('category_id') id: number, @Body() categoryDto: CategoryDto): Promise<CategoryDto> {
        console.log('updateCategory')
        return this.categoryService.updateOneById(id, categoryDto);
    }


    @Delete('delete/:id')
    async deleteCategoryById(@Param('id') id: number): Promise<void> {
        console.log(await this.categoryService.deleteOneById(id));
    }

    
    @Get('get-categories')
    async getCategories(): Promise<CategoryDto[]> {
        return await this.categoryService.getAll();
    }


    @Get(':id')
    async getCategory(@Param('id') id: number): Promise<CategoryDto> {
        return await this.categoryService.getOneById(id);
    }
}