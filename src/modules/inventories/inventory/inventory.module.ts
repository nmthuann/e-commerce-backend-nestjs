import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductSerialEntity } from './domain/entities/product-serial.entity'
import { InventoryController } from './controllers/inventory.controller'
import { InventoryService } from './services/impl/inventory.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProductSerialEntity])],
  controllers: [InventoryController],
  providers: [
    {
      provide: 'IInventoryService',
      useClass: InventoryService
    }
  ],
  exports: ['IInventoryService']
})
export class InventoryModule {}
