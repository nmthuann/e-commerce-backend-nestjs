import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { PageDto } from 'src/common/dto/page.dto'
import { Role } from 'src/common/enums/role.enum'
import { CreatePriceDto, PriceHistoryItemDto } from '../dto/price.dto'
import { CreateSkuDto, SkuDetailDto, UpdateSkuDto } from '../dto/product-sku.dto'
import {
  AdminGetProductsQueryDto,
  CreateProductDto,
  ProductDetailDto,
  ProductSummaryDto,
  UpdateProductDto
} from '../dto/product.dto'
import { PriceEntity } from '../entities/price.entity'
import { PriceService } from '../services/price.service'
import { ProductSkuService } from '../services/product-sku.service'
import { ProductService } from '../services/product.service'

// Quản lý catalog: sản phẩm ngừng bán thì đặt isActive=false (không xóa vì đã gắn với serial / đơn hàng)
@ApiTags('Admin - Products')
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly skuService: ProductSkuService,
    private readonly priceService: PriceService
  ) {}

  @Get('products')
  findAll(@Query() query: AdminGetProductsQueryDto): Promise<PageDto<ProductSummaryDto>> {
    return this.productService.findAll(query, { includeInactive: true })
  }

  @Get('products/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductDetailDto> {
    return this.productService.findDetail({ id }, { includeInactive: true })
  }

  /** Tạo SPU kèm danh sách SKU (và giá ban đầu) trong 1 transaction */
  @Post('products')
  create(@CurrentUser('sub') actorId: string, @Body() data: CreateProductDto): Promise<ProductDetailDto> {
    return this.productService.create(data, actorId)
  }

  @Patch('products/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProductDto): Promise<ProductDetailDto> {
    return this.productService.update(id, data)
  }

  @Post('products/:id/skus')
  createSku(
    @CurrentUser('sub') actorId: string,
    @Param('id', ParseIntPipe) productId: number,
    @Body() data: CreateSkuDto
  ): Promise<SkuDetailDto> {
    return this.skuService.create(productId, data, actorId)
  }

  /** Sửa tên, thuộc tính, ảnh, ẩn/hiện SKU (không sửa skuCode, không sửa giá) */
  @Patch('skus/:id')
  updateSku(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSkuDto): Promise<SkuDetailDto> {
    return this.skuService.update(id, data)
  }

  /** Lịch sử giá, mới nhất trước; isCurrent đánh dấu giá đang áp dụng */
  @Get('skus/:id/prices')
  getPrices(@Param('id', ParseIntPipe) id: number): Promise<PriceHistoryItemDto[]> {
    return this.priceService.getHistory(id)
  }

  /** Đổi giá = tạo bản ghi giá mới (có thể đặt beginAt tương lai); không có API sửa / xóa giá */
  @Post('skus/:id/prices')
  createPrice(
    @CurrentUser('sub') actorId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreatePriceDto
  ): Promise<PriceEntity> {
    return this.priceService.create(id, data, actorId)
  }
}
