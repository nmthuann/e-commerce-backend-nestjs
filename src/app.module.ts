import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { AuthGuard } from './common/guards/auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuthContextMiddleware } from './common/middlewares/auth-context.middleware'
import { LoggerMiddleware } from './common/middlewares/logger.middleware'
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware'
import { validateEnv } from './config/env.validation'
import { typeOrmConfigFactory } from './config/typeorm.config'
import { AuthModule } from './modules/auth/auth.module'
import { InventoriesModule } from './modules/inventories/inventories.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProductsModule } from './modules/products/products.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: typeOrmConfigFactory }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
    InventoriesModule
  ],
  controllers: [AppController],
  providers: [
    // Request lifecycle: Middleware → Guards → Interceptors → Pipes → Handler → Interceptors → Filters
    // Guard chạy theo thứ tự khai báo: xác thực trước, phân quyền sau
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware, AuthContextMiddleware).forRoutes('{*splat}')
  }
}
