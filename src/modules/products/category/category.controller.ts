import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ICategoryService } from './category.service.interface'

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService
  ) {}

  @Get()
  async getAll(@Query('categoryUrl') query: string) {
    if (query) {
      return await this.categoryService.getOneBySlug(query)
    }
    return await this.categoryService.getAll()
  }
}
