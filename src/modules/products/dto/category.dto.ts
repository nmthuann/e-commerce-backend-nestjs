import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator'
import { SLUG_PATTERN } from 'src/common/utils/slug.util'

export class CreateCategoryDto {
  @IsString()
  @Length(1, 100)
  name: string

  /** Bỏ trống → tự sinh từ name */
  @IsOptional()
  @Matches(SLUG_PATTERN, { message: 'slug chỉ gồm chữ thường, số và dấu gạch ngang' })
  @MaxLength(120)
  slug?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
