import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AccountEntity } from "../account/account.entity";
import { AccountModule } from "../account/account.module";
import { OrderEntity } from "src/modules/orders/order/order.entity";
import { OrderModule } from "src/modules/orders/order/order.module";
import { JwtModule } from "@nestjs/jwt";
import { AccountService } from "../account/account.service";
import { AuthModule } from "src/modules/authentication/auth.module";
import { AuthService } from "src/modules/authentication/auth.service";

@Module({
    imports:[
        // forwardRef(() => OrderModule),
        // TypeOrmModule.forFeature([UserEntity, AccountEntity, OrderEntity]),

        TypeOrmModule.forFeature([UserEntity,]),
        JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
        AccountModule,
       // AuthModule
    ],
    controllers: [UserController],
    providers: [
        {
            provide: 'IUserService',
            useClass: UserService,
        },
       
        // {
        //     provide: 'IAccountService',
        //     useClass: AccountService,
        // },
        // AuthService,
    ],
    exports: ['IUserService',]
})
export class UserModule {}