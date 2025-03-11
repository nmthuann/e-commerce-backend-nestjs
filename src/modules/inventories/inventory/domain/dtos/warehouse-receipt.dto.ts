import { ProductSerialDto } from './product-serial.dto'

export class WarehouseReceiptDto {
  id: number
  purchaseOrderId: number
  employeeId: number
  receiptNumber: string
  receiptDate: Date
  createdAt: Date
  productSerials: ProductSerialDto[]
}
