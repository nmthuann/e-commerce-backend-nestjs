export class WarehouseReceiptResponse {
  id: number
  receiptNumber: string
  purchaseOrder: PurchaseOrder
  employeeId: number
  receiptDate: Date
  createdAt: Date
}

export class PurchaseOrder {
  id: number
  orderNumber: string
  orderDate: Date
  createdAt: Date
}
