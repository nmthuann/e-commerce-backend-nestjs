import { Module } from '@nestjs/common'

import { CartModule } from './cart/cart.module'

@Module({
  imports: [CartModule]
})
export class OrdersModule {}
