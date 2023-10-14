import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AccountEntity } from "src/modules/users/account/account.entity";
import { AccountModule } from "src/modules/users/account/account.module";
import { UserEntity } from "../users/user/user.entity";
import { UserModule } from "../users/user/user.module";
import { OrderModule } from "../orders/order/order.module";
import { EmployeeModule } from "../users/employee/employee.module";

@Module({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
        // TypeOrmModule.forFeature([AccountEntity]),
        AccountModule,
        //UserModule
       
      ],
      controllers: [AuthController],
      providers: [
       {
            provide: 'IAuthService',
            useClass: AuthService,
        },
      ]
})
export class AuthModule  {}
// implements NestModule{
//     configure(consumer: MiddlewareConsumer) {
//         consumer.apply(AuthenticationMiddleware)
//         .exclude(
//           { path: 'auth/login', method: RequestMethod.POST },
//           { path: 'auth/register', method: RequestMethod.POST },
//           { path: 'auth/show-list', method: RequestMethod.GET },
//           // { path: 'auth/logout', method: RequestMethod.POST },
//         )
//         .forRoutes(AuthController);
//     }
// }