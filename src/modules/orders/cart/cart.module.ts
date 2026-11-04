import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItemEntity } from './cart-item.entity'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { ProductModule } from 'src/modules/products/product/product.module'

// TODO(P5.1): xóa module này — chuyển sang cart ảo trên frontend + POST /orders/preview
@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity]), ProductModule],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartService',
      useClass: CartService
    }
  ],
  exports: ['ICartService']
})
export class CartModule {}
