import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { CreateBrandDto, UpdateBrandDto } from '../dto/brand.dto'
import { BrandEntity } from '../entities/brand.entity'
import { BrandService } from '../services/brand.service'

@ApiTags('Brands')
@Controller()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Public()
  @Get('brands')
  findAll(): Promise<BrandEntity[]> {
    return this.brandService.findAll()
  }

  @Public()
  @Get('brands/:slug')
  findOne(@Param('slug') slug: string): Promise<BrandEntity> {
    return this.brandService.findOne({ slug })
  }

  @Roles(Role.ADMIN)
  @Post('admin/brands')
  create(@Body() data: CreateBrandDto): Promise<BrandEntity> {
    return this.brandService.create(data)
  }

  @Roles(Role.ADMIN)
  @Patch('admin/brands/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateBrandDto): Promise<BrandEntity> {
    return this.brandService.update(id, data)
  }

  /** Chỉ xóa được khi không còn sản phẩm thuộc thương hiệu */
  @Roles(Role.ADMIN)
  @Delete('admin/brands/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.brandService.remove(id)
  }
}
