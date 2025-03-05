import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItemEntity } from './cart-item.entity'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { ProductModule } from 'src/modules/products/product/product.module'
import { AuthMiddleware } from 'src/middlewares/auth.middleware'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
    TypeOrmModule.forFeature([CartItemEntity]),
    ProductModule
  ],
  controllers: [CartController],
  providers: [
    {
      provide: 'ICartService',
      useClass: CartService
    }
  ],
  exports: ['ICartService']
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CartController)
  }
}
