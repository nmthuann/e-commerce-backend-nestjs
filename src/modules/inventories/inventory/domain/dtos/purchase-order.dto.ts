import { PurchaseOrderDetailDto } from './purchase-order-detail.dto'

export class PurchaseOrderDto {
  id: number
  orderNumber: string
  supplierId: number
  employeeId: number
  orderDate: Date
  purchaseOrderDetails: PurchaseOrderDetailDto[]
}
