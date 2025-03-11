import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductSerialEntity } from './domain/entities/product-serial.entity'
import { UsersModule } from 'src/modules/users/users.module'
import { PurchaseOrderService } from './services/impl/purchase-order.service'
import { PurchaseOrderController } from './controllers/purchase-order.controller'
import { AuthMiddleware } from 'src/middlewares/auth.middleware'
import { PurchaseOrderEntity } from './domain/entities/purchase-order.entity'
import { PurchaseOrderDetailEntity } from './domain/entities/purchase-order-detail.entity'
import { JwtModule } from '@nestjs/jwt'
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
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
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
export class InventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'productSerials', method: RequestMethod.GET })
      .exclude({ path: 'purchaseOrders', method: RequestMethod.GET })
      .exclude({ path: 'purchaseOrders/:id', method: RequestMethod.GET })
      .exclude({ path: 'warehouseReceipts', method: RequestMethod.GET })
      .exclude({ path: 'warehouseReceipts/:id', method: RequestMethod.GET })
      .forRoutes(ProductSerialController, PurchaseOrderController, WarehouseReceiptController)
  }
}
