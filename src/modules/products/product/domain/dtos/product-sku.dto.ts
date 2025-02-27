import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { Attribute } from 'src/common/types/attribute.type'

export class ProductSkuDto {
  @ApiProperty({ description: 'ID của SKU', example: 1 })
  @IsInt()
  readonly id: number

  @ApiProperty({ description: 'Mã SKU', example: 'SKU12345' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  readonly skuNo: string

  @ApiProperty({ description: 'Mã barcode', example: '8934567890123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  readonly barcode: string

  @ApiProperty({ description: 'Tên SKU', example: 'Dầu ăn Oliu 1L' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  readonly skuName: string

  @ApiProperty({ description: 'Hình ảnh sản phẩm', example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly image: string

  @ApiProperty({ description: 'Trạng thái SKU', example: true })
  @IsBoolean()
  readonly status: boolean

  @ApiPropertyOptional({ description: 'Thuộc tính SKU', example: { color: 'red', size: 'M' } })
  @IsOptional()
  readonly skuAttributes?: Attribute[]

  @ApiProperty({ description: 'Slug của SKU', example: 'dau-an-oliu-1l' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly slug: string

  // readonly price: PriceDto

  // readonly stock: number // check with Inventories Modules

  @ApiProperty({ description: 'Giá bán của SKU', example: 28500000 })
  @IsInt()
  readonly sellingPrice: number

  @ApiProperty({ description: 'Giá hiển thị của SKU', example: 30500000 })
  @IsInt()
  readonly displayPrice: number

  @ApiProperty({ description: 'Số lượng của SKU', example: 2 })
  @IsInt()
  readonly stock: number
}
