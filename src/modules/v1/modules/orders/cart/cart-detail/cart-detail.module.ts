import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetailEntity } from '../cart-detail.entity';
import { CartDetailController } from './cart-detail.controller';
import { CartDetailService } from './cart-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartDetailEntity])],
  controllers: [CartDetailController],
  providers: [
    {
      provide: 'ICartDetailService',
      useClass: CartDetailService,
    },
  ],
  exports: ['ICartDetailService'],
})
export class CartDetailModule {}
