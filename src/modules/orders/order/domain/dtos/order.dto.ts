import { OrderCustomerDto } from './order-customer.dto'
import { OrderDetailDto } from './order-detail.dto'
import { OrderEmployeeDto } from './order-employee.dto'

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
  customer: OrderCustomerDto
  employee: OrderEmployeeDto
  orderDetails: OrderDetailDto[]
}
