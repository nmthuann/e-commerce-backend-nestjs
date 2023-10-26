import {

  Module,

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

@Module({
  imports: [
    //      JwtModule.register({
    //       secret: 'JWT_SECRET_KEY',
    //       signOptions: { expiresIn: 60},
    //     }),
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
export class OrderModule {}
