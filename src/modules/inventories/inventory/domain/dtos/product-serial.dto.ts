import { SkuDto } from './purchase-order-detail.dto'

export class ProductSerialDto {
  id: string
  serialNumber: string
  dateManufactured: Date
  sku: SkuDto
}
