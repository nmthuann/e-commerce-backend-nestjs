import { OmitType, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, IsUrl, Length, Matches, MaxLength, Min } from 'class-validator'
import { CurrentPriceDto } from './price.dto'

export class CreateSkuDto {
  /** Mã SKU nội bộ (chữ in hoa, số, gạch ngang), không đổi sau khi tạo */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^[A-Z0-9][A-Z0-9-]{2,49}$/, { message: 'skuCode gồm 3–50 ký tự A-Z, 0-9 hoặc -' })
  skuCode: string

  @IsString()
  @Length(1, 255)
  name: string

  /** vd { "Màu": "Xanh", "Dung lượng": "256GB" } */
  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imageUrl?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  /** Giá bán ban đầu (áp dụng ngay); bỏ trống = chưa mở bán */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sellingPrice?: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  displayPrice?: number
}

// Đổi giá dùng POST /admin/skus/:id/prices, không sửa qua đây
export class UpdateSkuDto extends PartialType(OmitType(CreateSkuDto, ['skuCode', 'sellingPrice', 'displayPrice'] as const)) {}

export class SkuDetailDto {
  id: number
  skuCode: string
  name: string
  attributes?: Record<string, string>
  imageUrl?: string
  isActive: boolean
  /** null = chưa có giá đang áp dụng → chưa bán được */
  price: CurrentPriceDto | null
  /** Số serial AVAILABLE */
  stock: number
}
