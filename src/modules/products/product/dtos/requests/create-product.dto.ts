import { IsString, IsOptional, IsInt, IsJSON, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  @IsString()
  @Length(1, 255)
  productName: string;

  @ApiProperty({ example: 'product-name', description: 'Unique slug for the product' })
  @IsString()
  @Length(1, 100)
  slug: string;

  @ApiProperty({ example: 'Electronics', description: 'Product line' })
  @IsString()
  @Length(1, 100)
  productLine: string;

  @ApiProperty({ example: 'This is a product description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority sorting order' })
  @IsInt()
  @IsOptional()
  prioritySort?: number;

  @ApiProperty({ example: { color: 'red', size: 'L' }, required: false })
  @IsOptional()
  @IsJSON()
  productSpecs?: Record<string, unknown>;

  @ApiProperty({ example: 1, required: false, description: 'Category ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 1, required: false, description: 'Brand ID' })
  @IsInt()
  @IsOptional()
  brandId?: number;
}
