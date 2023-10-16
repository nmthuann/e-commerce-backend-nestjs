import {   Module } from '@nestjs/common';
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
import { ImageEntity } from './modules/products/image/image.entity';
import { ShippingEntity } from './modules/orders/shipping/shipping.entity';
import { PaymentEntity } from './modules/orders/payment/payment.entity';
import { OrderDetailEntity } from './modules/orders/order/order-detail.entity';
import { DiscountModule } from './modules/products/discount/discount.module';
import { ProductModule } from './modules/products/product/product.module';
import { ImageModule } from './modules/products/image/image.module';
import { CartModule } from './modules/orders/cart/cart.module';
import { CartDetailModule } from './modules/orders/cart/cart-detail/cart-detail.module';
import { OrderModule } from './modules/orders/order/order.module';
import { OrderDetailModule } from './modules/orders/order/order-detail/order-detail.module';
import { ShippingModule } from './modules/orders/shipping/shipping.module';
import { PaymentModule } from './modules/orders/payment/payment.module';
import { UserModule } from './modules/users/user/user.module';
import { EmployeeModule } from './modules/users/employee/employee.module';
import { PositionModule } from './modules/users/position/position.module';
import { AccountModule } from './modules/users/account/account.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { StoreModule } from './modules/apis/store/store.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/authentication/auth.module';
// import { CacheModule } from '@nestjs/cache-manager';



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
        synchronize: false, // false, 
        options: {
          trustServerCertificate: true, // Allow self-signed certificates
        },
        entities: [
          CategoryEntity, DiscountEntity, ProductEntity, ImageEntity,
          CartEntity, CartDetailEntity,
          OrderEntity, OrderDetailEntity, ShippingEntity, PaymentEntity,
          UserEntity, AccountEntity, EmployeeEntity, PositionEntity
        ]
      }
    ),

  // CategoryModule,
  // DiscountModule,
  // ProductModule,
  // ImageModule,
  // // StoreModule,

  // // CartModule,
  // // CartDetailModule,
  // OrderModule,
  // // OrderDetailModule,
  //ShippingModule,
  // PaymentModule,

  // UserModule,
  // EmployeeModule,
  // // //PositionModule,
  // AccountModule,

    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: 'localhost',//localhost
    //   port: 6379,//6379
    //   // password: 'pqTtSGQM5oHvURGfFWaO7qWcTi3kcWr8',
    //   // ttl: 60*60*15, // seconds
    // }),

    AuthModule,
    // EmployeeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  
