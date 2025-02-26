import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { StripeController } from './stripe.controller'
import { StripeService } from './stripe.service'
import { OrderModule } from '../order/order.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthMiddleware } from '../../../middlewares/auth.middleware'
import { ProductModule } from '../../products/product/product.module'

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 }
    }),
    OrderModule,
    ProductModule
  ],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude({ path: 'webhook', method: RequestMethod.POST }).forRoutes(StripeController)
  }
}
