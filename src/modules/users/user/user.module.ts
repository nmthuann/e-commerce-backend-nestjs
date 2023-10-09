import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AccountEntity } from "../account/account.entity";
import { AccountModule } from "../account/account.module";
import { OrderEntity } from "src/modules/orders/order/order.entity";
import { OrderModule } from "src/modules/orders/order/order.module";
import { AuthModule } from "src/modules/apis/authentication/auth.module";
import { AuthService } from "src/modules/apis/authentication/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AccountService } from "../account/account.service";

@Module({
    imports:[
        // forwardRef(() => OrderModule),
       TypeOrmModule.forFeature([UserEntity, AccountEntity, OrderEntity]),
               JwtModule.register({
          secret: 'JWT_SECRET_KEY',
          signOptions: { expiresIn: 60},
        }),
       // AccountModule,
       AuthModule
    ],
    controllers: [UserController],
    providers: [
        {
            provide: 'IUserService',
            useClass: UserService,
        },
        AuthService,
        {
            provide: 'IAccountService',
            useClass: AccountService,
        },
    ],
    exports: ['IUserService',]
})
export class UserModule {}