import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { ICategoryService } from './category.service.interface'

@ApiTags('Categories')
@Public()
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
