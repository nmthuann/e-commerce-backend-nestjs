import { OrderDetailDto } from './order-detail.dto'
import { PublicUserDto } from 'src/modules/users/domain/dtos/user.dto'

export class OrderDto {
  id: number
  employee: PublicUserDto
  user: PublicUserDto
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
  orderDetails: OrderDetailDto[]
}
