import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ProductEntity } from "src/modules/products/product/entities/product.entity";
import { OrderDetailEntity } from "./order-detail.entity";
import { ShippingEntity } from "../shipping/shipping.entity";
import { PaymentEntity } from "../payment/payment.entity";
import { EmployeeEntity } from "src/modules/users/employee/employee.entity";
import { UserEntity } from "src/modules/users/user/user.entity";
import { DiscountEntity } from "src/modules/products/discount/discount.entity";
import { OrderDetailModule } from "./order-detail/order-detail.module";
import { DiscountModule } from "src/modules/products/discount/discount.module";
import { ProductModule } from "src/modules/products/product/product.module";
import { ShippingModule } from "../shipping/shipping.module";
import { PaymentModule } from "../payment/payment.module";
import { EmployeeModule } from "src/modules/users/employee/employee.module";
import { UserModule } from "src/modules/users/user/user.module";
import { StripeController } from "./stripe/stripe.controller";
import { StripeService } from "./stripe/stripe.service";
import { AuthenticationMiddleware } from "src/common/middlewares/authentication.middleware";
import { AdminRoleGuard } from "src/common/guards/admin.role.guard";
import { UserRoleGuard } from "src/common/guards/user.role.guard";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
         JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
       TypeOrmModule.forFeature([
            OrderEntity,
            ProductEntity,
            OrderDetailEntity,
            ShippingEntity,
            PaymentEntity,
            EmployeeEntity,
            UserEntity,
            DiscountEntity,
        ]),
        DiscountModule,
        ProductModule,
        OrderDetailModule,
        ShippingModule,
        PaymentModule,
        EmployeeModule,
        UserModule,
        ProductModule,
    ],
    controllers: [OrderController, StripeController],
    providers: [
        {
            provide: 'IOrderService',
            useClass: OrderService,
        },
        StripeService,
        AdminRoleGuard,
        UserRoleGuard,
    ],
    exports: ['IOrderService',]
})
export class OrderModule{}
// {} implements NestModule{
//     configure(consumer: MiddlewareConsumer) {
//         consumer.apply(AuthenticationMiddleware)
//         .exclude(
//             { path: 'order/get-orders', method: RequestMethod.GET },
//             { path: 'order/get-task-orders', method: RequestMethod.GET },
//             { path: 'order/get-customer-list', method: RequestMethod.GET },
//             { path: 'order/create-offline', method: RequestMethod.POST },
//           )
//         .forRoutes(OrderController);
//     }
// }    // {}