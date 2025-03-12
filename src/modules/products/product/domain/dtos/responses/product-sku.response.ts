import { ApiProperty } from '@nestjs/swagger'
import { Attribute } from 'src/common/types/attribute.type'

export class ProductSkuResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  skuNo: string

  @ApiProperty()
  barcode: string

  @ApiProperty()
  skuName: string

  @ApiProperty()
  image: string

  @ApiProperty()
  status: boolean

  @ApiProperty()
  slug: string

  @ApiProperty()
  skuAttributes: Attribute[]

  @ApiProperty()
  stock: number
}

//   @ApiProperty({ required: false })
//   sellingPrice: number

//   @ApiProperty()
//   displayPrice: number
