import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductSerialEntity } from './domain/entities/product-serial.entity'
import { UsersModule } from 'src/modules/users/users.module'
import { PurchaseOrderService } from './services/impl/purchase-order.service'
import { PurchaseOrderController } from './controllers/purchase-order.controller'
import { PurchaseOrderEntity } from './domain/entities/purchase-order.entity'
import { PurchaseOrderDetailEntity } from './domain/entities/purchase-order-detail.entity'
import { WarehouseReceiptService } from './services/impl/warehouse-receipt.service'
import { WarehouseReceiptController } from './controllers/warehouse-receipt.controller'
import { WarehouseReceiptEntity } from './domain/entities/warehouse-receipt.entity'
import { ProductSerialService } from './services/impl/product-serial.service'
import { ProductSerialController } from './controllers/product-serial.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrderEntity,
      PurchaseOrderDetailEntity,
      WarehouseReceiptEntity,
      ProductSerialEntity
    ]),
    UsersModule
  ],
  controllers: [ProductSerialController, PurchaseOrderController, WarehouseReceiptController],
  providers: [
    {
      provide: 'IProductSerialService',
      useClass: ProductSerialService
    },
    {
      provide: 'IPurchaseOrderService',
      useClass: PurchaseOrderService
    },
    {
      provide: 'IWarehouseReceiptService',
      useClass: WarehouseReceiptService
    }
  ],
  exports: ['IProductSerialService', 'IPurchaseOrderService', 'IWarehouseReceiptService']
})
export class InventoryModule {}
