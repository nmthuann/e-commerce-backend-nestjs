import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { PageDto } from 'src/common/dto/page.dto'
import { GetProductsQueryDto, ProductDetailDto, ProductSummaryDto } from '../dto/product.dto'
import { ProductService } from '../services/product.service'

// Catalog công khai: chỉ sản phẩm / SKU đang bán
@ApiTags('Products')
@Public()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /** Lọc theo thương hiệu, danh mục, khoảng giá, từ khóa, còn hàng; có phân trang và sắp xếp */
  @Get()
  findAll(@Query() query: GetProductsQueryDto): Promise<PageDto<ProductSummaryDto>> {
    return this.productService.findAll(query, { includeInactive: false })
  }

  /** Chi tiết sản phẩm kèm SKU, giá hiện hành và tồn kho */
  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<ProductDetailDto> {
    return this.productService.findDetail({ slug }, { includeInactive: false })
  }
}
