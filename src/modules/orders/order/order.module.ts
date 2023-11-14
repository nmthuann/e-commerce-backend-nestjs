import {

  MiddlewareConsumer,
  Module, NestModule, RequestMethod,

} from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { DiscountModule } from 'src/modules/products/discount/discount.module';
import { ProductModule } from 'src/modules/products/product/product.module';
import { ShippingModule } from '../shipping/shipping.module';
import { PaymentModule } from '../payment/payment.module';
import { EmployeeModule } from 'src/modules/users/employee/employee.module';
import { UserModule } from 'src/modules/users/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: 60 },
    }),
    TypeOrmModule.forFeature([OrderEntity]),
    DiscountModule,
    ProductModule,
    OrderDetailModule,
    ShippingModule,
    PaymentModule,

    EmployeeModule,
    UserModule,

    ProductModule,

  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'IOrderService',
      useClass: OrderService,
    },

    // AdminRoleGuard,
    // UserRoleGuard,
  ],
  exports: ['IOrderService'],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'order/update-inprogress/:order_id', method: RequestMethod.PATCH },
        { path: 'order/update-completed/:order_id', method: RequestMethod.PATCH },
        { path: 'order/update-refunded/:order_id', method: RequestMethod.PATCH },

        { path: 'order/get-task-orders', method: RequestMethod.GET },
        { path: 'order/get-orders', method: RequestMethod.GET },
        { path: 'order/get-customer-list', method: RequestMethod.GET },
        { path: 'order/get-total-revenue', method: RequestMethod.GET },
        { path: 'order/get-orders-has-completed-status', method: RequestMethod.GET },
        { path: 'order/get-revenue-by-month', method: RequestMethod.GET },
        { path: 'order/get-total-price/:order_id', method: RequestMethod.GET },
        { path: 'order/:id', method: RequestMethod.GET },
        { path: 'order/count-product-sold', method: RequestMethod.GET },
        { path: 'order/statistical-OnOffOrder-count', method: RequestMethod.GET },
        { path: 'order/statistical-category-by-order', method: RequestMethod.GET },
        { path: 'order/find-top-user-buy-product', method: RequestMethod.GET },
      )
      .forRoutes(OrderController);
  }
}