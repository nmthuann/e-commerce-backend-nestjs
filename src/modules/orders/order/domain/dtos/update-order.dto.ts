import { OrderStatus } from 'src/constants/order-status.enum'

export class UpdateOrderDto {
  status: OrderStatus
}
