import { OmitType, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { PageOptionsDto } from 'src/common/dto/page-options.dto'
import { SLUG_PATTERN } from 'src/common/utils/slug.util'
import { CreateSkuDto, SkuDetailDto } from './product-sku.dto'

const toBoolean = ({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value)

export enum ProductSort {
  FEATURED = 'featured',
  NEWEST = 'newest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME = 'name'
}

export class GetProductsQueryDto extends PageOptionsDto {
  /** Tìm theo tên sản phẩm */
  @IsOptional()
  @IsString()
  q?: string

  /** Slug thương hiệu */
  @IsOptional()
  @IsString()
  brand?: string

  /** Slug danh mục */
  @IsOptional()
  @IsString()
  category?: string

  /** Lọc theo giá bán thấp nhất của sản phẩm ("giá từ") */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number

  /** true = chỉ sản phẩm còn hàng */
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  inStock?: boolean

  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort = ProductSort.FEATURED
}

export class AdminGetProductsQueryDto extends GetProductsQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean
}

export class CreateProductDto {
  @IsString()
  @Length(1, 255)
  name: string

  /** Bỏ trống → tự sinh từ name */
  @IsOptional()
  @Matches(SLUG_PATTERN, { message: 'slug chỉ gồm chữ thường, số và dấu gạch ngang' })
  @MaxLength(255)
  slug?: string

  @IsInt()
  brandId: number

  @IsInt()
  categoryId: number

  @IsOptional()
  @IsString()
  description?: string

  /** Thông số chung, vd { "Màn hình": "6.1 inch" } */
  @IsOptional()
  @IsObject()
  specs?: Record<string, string>

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  warrantyMonths?: number

  @IsOptional()
  @IsInt()
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  /** Danh sách biến thể; tạo cùng SPU trong 1 transaction */
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto)
  @ArrayMinSize(1)
  skus: CreateSkuDto[]
}

// Thêm SKU dùng POST /admin/products/:id/skus
export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['skus'] as const)) {}

export class CatalogRefDto {
  id: number
  name: string
  slug: string
}

export class ProductSummaryDto {
  id: number
  name: string
  slug: string
  brand: CatalogRefDto
  category: CatalogRefDto
  thumbnailUrl: string | null
  /** Giá bán thấp nhất / cao nhất trong các SKU đang có giá; null = chưa mở bán */
  minPrice: number | null
  maxPrice: number | null
  /** Giá niêm yết của SKU rẻ nhất */
  displayPrice: number | null
  /** Tổng serial AVAILABLE của các SKU */
  stock: number
  skuCount: number
  isActive: boolean
}

export class ProductDetailDto {
  id: number
  name: string
  slug: string
  description?: string
  specs?: Record<string, string>
  warrantyMonths: number
  isActive: boolean
  sortOrder: number
  brand: CatalogRefDto
  category: CatalogRefDto
  skus: SkuDetailDto[]
}
