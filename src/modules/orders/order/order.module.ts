import { Module } from "@nestjs/common";
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

@Module({
    imports:[
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
    controllers: [OrderController],
    providers: [
        {
            provide: 'IOrderService',
            useClass: OrderService,
        },
    ],
    exports: ['IOrderService',]
})
export class OrderModule {}