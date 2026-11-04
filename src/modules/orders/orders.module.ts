import { Module } from '@nestjs/common'
import { OrderModule } from './order/order.module'

// Không có cart phía server (D1): giỏ hàng lưu ở frontend, backend kiểm tra qua POST /orders/preview (P5.2)
@Module({
  imports: [OrderModule]
})
export class OrdersModule {}
