import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { AuthMiddleware } from "src/common/middlewares/auth.middleware";
import { OrderModule } from "../order/order.module";
import { ProductModule } from "src/modules/products/product/product.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [
     JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
    OrderModule,
    ProductModule
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware)
        .exclude(
            { path: 'webhook', method: RequestMethod.POST },
          )
        .forRoutes(StripeController);
    }
} 
  