import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { PurchaseOrderDetailEntity } from './entities/purchase-order-detail.entity';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { WarehouseReceiptEntity } from './entities/warehouse-receipt.entity';
import { ProductSerialEntity } from './entities/product-serial.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity, 
      PurchaseOrderEntity, 
      PurchaseOrderDetailEntity,
      WarehouseReceiptEntity,
      ProductSerialEntity,
    ])],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export class InventoriesModule {}