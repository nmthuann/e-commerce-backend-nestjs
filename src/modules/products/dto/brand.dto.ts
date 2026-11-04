import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl, Length, Matches, MaxLength } from 'class-validator'
import { SLUG_PATTERN } from 'src/common/utils/slug.util'

export class CreateBrandDto {
  @IsString()
  @Length(1, 100)
  name: string

  /** Bỏ trống → tự sinh từ name */
  @IsOptional()
  @Matches(SLUG_PATTERN, { message: 'slug chỉ gồm chữ thường, số và dấu gạch ngang' })
  @MaxLength(120)
  slug?: string

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  logoUrl?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
