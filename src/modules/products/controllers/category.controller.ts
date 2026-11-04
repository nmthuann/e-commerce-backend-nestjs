import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { CategoryEntity } from '../entities/category.entity'
import { CategoryService } from '../services/category.service'

@ApiTags('Categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get('categories')
  findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll()
  }

  @Public()
  @Get('categories/:slug')
  findOne(@Param('slug') slug: string): Promise<CategoryEntity> {
    return this.categoryService.findOne({ slug })
  }

  @Roles(Role.ADMIN)
  @Post('admin/categories')
  create(@Body() data: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.create(data)
  }

  @Roles(Role.ADMIN)
  @Patch('admin/categories/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.update(id, data)
  }

  /** Chỉ xóa được khi không còn sản phẩm thuộc danh mục */
  @Roles(Role.ADMIN)
  @Delete('admin/categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id)
  }
}
