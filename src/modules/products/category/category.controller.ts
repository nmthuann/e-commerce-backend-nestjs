import { Controller, Get, Inject } from "@nestjs/common";
import { ICategoryService } from "./category.service.interface";
import { CategoryDto } from "./category.dto";

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService
  ) {}

  @Get()
  async getAll(): Promise<CategoryDto[]> {
    return await this.categoryService.getAll();
  }
}
