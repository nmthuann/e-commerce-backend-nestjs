import { OrderStatus } from 'src/constants/order-status.enum'

export class OrderResponse {
  id: number
  userId: string
  employeeId: number
  status: OrderStatus
  orderType: boolean //1: ON, 0: OFF
  shippingAddress: string
  contactPhone: string
  shippingMethod: string
  paymentMethod: string
  note: string
  createdAt: Date
  updatedAt: Date
  shippingFee: number
  discount: number
  postcode: string
}
