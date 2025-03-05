import { Attribute } from 'src/common/types/attribute.type'

export class PurchaseOrderDetailDto {
  sku: SkuDto
  quantity: number
  unitPrice: number
}

type SkuDto = {
  id: number
  skuNo: string
  barcode: string
  skuName: string
  image: string
  status: boolean
  skuAttributes: Attribute[]
  slug: string
}
