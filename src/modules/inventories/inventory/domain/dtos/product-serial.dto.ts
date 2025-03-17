import { SkuDto } from './purchase-order-detail.dto'

// TODO: Pick<T, K> and  Omit<T, K>???
export class ProductSerialDto {
  id: string
  serialNumber: string
  dateManufactured: Date
  sku: SkuDto
}
