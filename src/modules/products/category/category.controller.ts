import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { CategoryDto } from './category-dto/category.dto';
import { ICategoryService } from './category.service.interface';
import { CreateCategoryDto } from './category-dto/create-category.dto';
import { CategoryEntity } from './category.entity';
import { DeleteResult } from 'typeorm';

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


    @Delete('delete/:category_id')
    async deleteCategoryById(@Param('category_id') id: number): Promise<DeleteResult> {
        // console.log(await this.categoryService.deleteOneById(id));
        
        return await this.categoryService.deleteOneById(id);
        // } catch (error) {
        //     console.log(`${error} has a problem`)
        //     throw error
        // }
    }

    
    @Get('get-categories')
    async getCategories(): Promise<CategoryDto[]> {
        return await this.categoryService.getAll();
    }

    // @Get('get-produc-by-id')
    // async getProdcutByCategoryId(): Promise<CategoryEntity[]> {
    //     return await this.categoryService.getProdcutByCategoryId(1);
    // }


    @Get(':id')
    async getCategory(@Param('id') id: number): Promise<CategoryDto> {
        return await this.categoryService.getOneById(id);
    }
}