import { Module } from '@nestjs/common'
import { CartModule } from './cart/cart.module'
import { OrderModule } from './order/order.module'

@Module({
  imports: [CartModule, OrderModule]
})
export class OrdersModule {}
