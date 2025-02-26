import { ApiProperty } from '@nestjs/swagger';

export class SkuResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  skuName: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  sellingPrice?: number;
}

export class ProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  categoryName?: string;

  @ApiProperty({ required: false })
  categoryUrl?: string;

  @ApiProperty({ required: false })
  brandName?: string;

  @ApiProperty({ required: false })
  brandUrl?: string;

  @ApiProperty({ type: [SkuResponse] })
  skus: SkuResponse[];
}
