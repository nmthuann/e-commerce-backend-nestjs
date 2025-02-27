import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { Attribute } from 'src/common/types/attribute.type'

export class ProductDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: 1 })
  @IsInt()
  readonly id: number

  @ApiProperty({ description: 'Tên sản phẩm', example: 'Dầu ăn Oliu' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly productName: string

  @ApiProperty({ description: 'Slug của sản phẩm', example: 'dau-an-oliu' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly slug: string

  @ApiProperty({ description: 'Dòng sản phẩm', example: 'Dầu ăn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly productLine: string

  @ApiPropertyOptional({ description: 'Mô tả sản phẩm', example: 'Dầu ăn Oliu nhập khẩu từ Ý' })
  @IsString()
  @IsOptional()
  readonly description?: string

  @ApiProperty({ description: 'Trạng thái sản phẩm', example: true })
  @IsBoolean()
  readonly status: boolean

  @ApiPropertyOptional({ description: 'Thông số sản phẩm', example: { color: 'red', size: 'M' } })
  @IsOptional()
  readonly productSpecs?: Attribute[]

  @ApiPropertyOptional({ description: 'Tên thương hiệu', example: 'Apple' })
  @IsOptional()
  readonly brandName?: string
}
