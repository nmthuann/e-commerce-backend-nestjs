import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderEntity } from './domain/entities/order.entity'
import { OrderDetailEntity } from './domain/entities/order-detail.entity'
import { InvoiceEntity } from './domain/entities/invoice.entity'
import { WarrantyEntity } from './domain/entities/warranty.entity'
import { WarrantyDetailEntity } from './domain/entities/warranty-detail.entity'
import { UsersModule } from 'src/modules/users/users.module'
import { OrderController } from './controllers/order.controller'
import { InvoiceController } from './controllers/invoice.controller'
import { OrderService } from './services/impl/order.service'
import { InvoiceService } from './services/impl/invoice.service'
import { WarrantyService } from './services/impl/warranty.service'
import { WarrantyController } from './controllers/warranty.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity, InvoiceEntity, WarrantyEntity, WarrantyDetailEntity]),
    UsersModule
  ],
  controllers: [OrderController, InvoiceController, WarrantyController],
  providers: [
    {
      provide: 'IOrderService',
      useClass: OrderService
    },
    {
      provide: 'IInvoiceService',
      useClass: InvoiceService
    },
    {
      provide: 'IWarrantyService',
      useClass: WarrantyService
    }
  ],
  exports: ['IOrderService', 'IInvoiceService', 'IWarrantyService']
})
export class OrderModule {}
