import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductSerialEntity } from './domain/entities/product-serial.entity'
import { InventoryController } from './controllers/inventory.controller'
import { InventoryService } from './services/impl/inventory.service'
import { UsersModule } from 'src/modules/users/users.module'
import { PurchaseOrderService } from './services/impl/purchase-order.service'
import { PurchaseOrderController } from './controllers/purchase-order.controller'
import { AuthMiddleware } from 'src/middlewares/auth.middleware'
import { PurchaseOrderEntity } from './domain/entities/purchase-order.entity'
import { PurchaseOrderDetailEntity } from './domain/entities/purchase-order-detail.entity'
import { SupplierEntity } from '../supplier/supplier.entity'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierEntity, PurchaseOrderEntity, PurchaseOrderDetailEntity, ProductSerialEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
    UsersModule
  ],
  controllers: [InventoryController, PurchaseOrderController],
  providers: [
    {
      provide: 'IInventoryService',
      useClass: InventoryService
    },
    {
      provide: 'IPurchaseOrderService',
      useClass: PurchaseOrderService
    }
  ],
  exports: ['IInventoryService', 'IPurchaseOrderService']
})
export class InventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'inventories', method: RequestMethod.GET })
      .exclude({ path: 'purchaseOrders', method: RequestMethod.GET })
      .forRoutes(InventoryController, PurchaseOrderController)
  }
}
