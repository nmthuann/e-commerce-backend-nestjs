import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderEntity } from './domain/entities/order.entity'
import { OrderDetailEntity } from './domain/entities/order-detail.entity'
import { InvoiceEntity } from './domain/entities/invoice.entity'
import { WarrantyEntity } from './domain/entities/warranty.entity'
import { WarrantyDetailEntity } from './domain/entities/warranty-detail.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity, InvoiceEntity, WarrantyEntity, WarrantyDetailEntity])
  ],
  providers: [],
  controllers: []
})
export class OrderModule {}
