import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/products/category/category.module';
import { CategoryEntity } from './modules/products/category/category.entity';
import { DiscountEntity } from './modules/products/discount/discount.entity';
import { ProductEntity } from './modules/products/product/entities/product.entity';
import { OrderEntity } from './modules/orders/order/order.entity';
import { CartEntity } from './modules/orders/cart/cart.entity';
import { UserEntity } from './modules/users/user/user.entity';
import { AccountEntity } from './modules/users/account/account.entity';
import { EmployeeEntity } from './modules/users/employee/employee.entity';
import { PositionEntity } from './modules/users/position/position.entity';
import { CartDetailEntity } from './modules/orders/cart/cart-detail.entity';
import { ImageEntity } from './modules/products/product/entities/image.entity';
import { ShippingEntity } from './modules/orders/order/shipping.entity';
import { PaymentEntity } from './modules/orders/order/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: '123456',
        database: 'TTTN_DongHoOnline',
        synchronize: true,
        options: {
          trustServerCertificate: true, // Allow self-signed certificates
        },
        entities: [
          CategoryEntity,
          DiscountEntity,
          ProductEntity,
          ImageEntity,

          OrderEntity,
          CartEntity,
          CartDetailEntity,
          ShippingEntity,
          PaymentEntity,

          UserEntity,
          AccountEntity,
          EmployeeEntity,
          PositionEntity
        ]
      }
    ),

    CategoryModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  
