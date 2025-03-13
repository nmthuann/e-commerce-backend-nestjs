import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './database/datasource'
import { UsersModule } from './modules/users/users.module'
import { InventoriesModule } from './modules/inventories/inventories.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProductsModule } from './modules/products/products.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
    InventoriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
