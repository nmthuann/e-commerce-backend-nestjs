import { OrderStatus } from 'src/constants/order-status.enum'
import { CreateOrderDetailDto } from './create-order-detail.dto'

// export class CreateOrderDto {
//   orderType: boolean // true: online, false: offline
//   shippingAddress: string // oke
//   contactPhone: string //
//   shippingMethod: string
//   paymentMethod: string
//   note: string
//   shippingFee: number // 0
//   discount: number // 0
//   postcode?: string
// }

export class CreateOrderDto {
  status: OrderStatus
  orderType: boolean
  shippingAddress: string
  contactPhone: string
  shippingMethod: string
  paymentMethod: string
  note: string
  orderDetails: CreateOrderDetailDto[]
}
