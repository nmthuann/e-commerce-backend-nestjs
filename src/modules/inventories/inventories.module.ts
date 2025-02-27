import { Module } from '@nestjs/common'
import { SupplierModule } from './supplier/supplier.module'
import { InventoryModule } from './inventory/inventory.module'

@Module({
  imports: [SupplierModule, InventoryModule]
})
export class InventoriesModule {}
