import { ApiProperty } from '@nestjs/swagger'
import { Attribute } from 'src/common/types/attribute.type'

export class SkuResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  skuName: string

  @ApiProperty()
  image: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  skuAttributes: Attribute[]

  @ApiProperty({ required: false })
  sellingPrice?: number

  @ApiProperty()
  displayPrice?: number
}

export class ProductResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  productName: string

  @ApiProperty()
  productLine: string

  @ApiProperty()
  status: boolean

  @ApiProperty()
  slug: string

  @ApiProperty()
  description: string

  @ApiProperty()
  productSpecs: Attribute[]

  @ApiProperty({ required: false })
  categoryName?: string

  @ApiProperty({ required: false })
  categoryUrl?: string

  @ApiProperty({ required: false })
  brandName?: string

  @ApiProperty({ required: false })
  brandUrl?: string

  @ApiProperty({ type: [SkuResponse] })
  skus: SkuResponse[]
}
