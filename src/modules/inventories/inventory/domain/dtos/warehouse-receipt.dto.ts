import { ProductSerialDto } from './product-serial.dto'

export class WarehouseReceiptDto {
  id: number
  receiptNumber: string
  purchaseOrderId: number
  receiptDate: Date
  employeeId: number
  productSerials: ProductSerialDto[]
}
