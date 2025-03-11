import { SkuDto } from './purchase-order-detail.dto'

export class ProductSerialResponse {
  id: string
  serialNumber: string
  dateManufactured: Date
  warehouseReceipt: WarehouseReceipt
  sku: SkuDto
}

export class WarehouseReceipt {
  id: number
  receiptNumber: string
  receiptDate: Date
  createdAt: Date
}
