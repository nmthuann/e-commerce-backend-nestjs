import { Module } from '@nestjs/common'
import { InventoriesController } from './inventory/controllers/inventories.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierEntity } from './entities/supplier.entity'
import { PurchaseOrderDetailEntity } from './entities/purchase-order-detail.entity'
import { PurchaseOrderEntity } from './entities/purchase-order.entity'
import { WarehouseReceiptEntity } from './entities/warehouse-receipt.entity'
import { ProductSerialEntity } from './entities/product-serial.entity'
import { InventoriesService } from './inventory/services/inventories.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      PurchaseOrderEntity,
      PurchaseOrderDetailEntity,
      WarehouseReceiptEntity,
      ProductSerialEntity
    ])
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService]
})
export class InventoriesModule {}
