import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItemEntity } from './cart-item.entity'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { ProductModule } from 'src/modules/products/product/product.module'

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
