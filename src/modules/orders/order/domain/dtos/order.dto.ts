import { OrderDetailDto } from './order-detail.dto'

export class OrderDto {
  id: number
  status: string
  orderType: boolean
  shippingAddress: string
  contactPhone: string
  shippingMethod: string
  paymentMethod: string
  note?: string
  createdAt: Date
  updatedAt: Date
  shippingFee: number
  discount: number
  postcode?: string
  // customer: OrderCustomerDto
  // employee: OrderEmployeeDto
  orderDetails: OrderDetailDto[]
}
