import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './database/datasource'
import { UsersModule } from './modules/users/users.module'
import { InventoriesModule } from './modules/inventories/inventories.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProductsModule } from './modules/products/products.module'

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), UsersModule, ProductsModule, InventoriesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
