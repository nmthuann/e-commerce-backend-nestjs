import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AppDataSource } from './database/datasource';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    // AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



    // TypeOrmModule.forRoot({
    //   type: 'mssql',
    //   host: 'localhost',
    //   port: 1433,
    //   username: 'sa',
    //   password: '123456',
    //   database: 'TTTN_DongHoOnline',
    //   synchronize: false, // false,
    //   options: {
    //     trustServerCertificate: true, // Allow self-signed certificates
    //   },
    //   entities: [
    //     CategoryEntity,
    //     DiscountEntity,
    //     ProductEntity,
    //     ImageEntity,
    //     CartEntity,
    //     CartDetailEntity,
    //     OrderEntity,
    //     OrderDetailEntity,
    //     ShippingEntity,
    //     PaymentEntity,
    //     UserEntity,
    //     AccountEntity,
    //     EmployeeEntity,
    //     PositionEntity,
    //   ],
    // }),

//     import { CategoryEntity } from './modules/products/category/category.entity';
// import { DiscountEntity } from './modules/products/discount/discount.entity';
// import { ProductEntity } from './modules/products/product/entities/product.entity';
// import { OrderEntity } from './modules/orders/order/order.entity';
// import { CartEntity } from './modules/orders/cart/cart.entity';
// import { UserEntity } from './modules/users/user/user.entity';
// import { AccountEntity } from './modules/users/account/account.entity';
// import { EmployeeEntity } from './modules/users/employee/employee.entity';
// import { PositionEntity } from './modules/users/position/position.entity';
// import { CartDetailEntity } from './modules/orders/cart/cart-detail.entity';
// import { ImageEntity } from './modules/products/image/image.entity';
// import { ShippingEntity } from './modules/orders/shipping/shipping.entity';
// import { PaymentEntity } from './modules/orders/payment/payment.entity';
// import { OrderDetailEntity } from './modules/orders/order/order-detail.entity';