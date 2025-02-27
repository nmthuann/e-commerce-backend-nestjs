import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItemEntity } from './entities/cart-item.entity'
import { OrderEntity } from './order/order.entity'
import { OrderDetailEntity } from './order/order-detail.entity'
import { InvoiceEntity } from './entities/invoice.entity'
import { WarrantyEntity } from './entities/warranty.entity'
import { WarrantyDetailEntity } from './entities/warranty-detail.entity'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItemEntity,
      OrderEntity,
      OrderDetailEntity,
      InvoiceEntity,
      WarrantyEntity,
      WarrantyDetailEntity
    ])
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
