import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../order-detail.entity';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { ProductEntity } from 'src/modules/v1/products/product/product.entity';
import { ProductModule } from 'src/modules/v1/products/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetailEntity, ProductEntity]),
    ProductModule,
  ],
  controllers: [OrderDetailController],
  providers: [
    {
      provide: 'IOrderDetailService',
      useClass: OrderDetailService,
    },
  ],
  exports: ['IOrderDetailService'],
})
export class OrderDetailModule {}
