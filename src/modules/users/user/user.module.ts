import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AccountEntity } from "../account/account.entity";
import { AccountModule } from "../account/account.module";
import { OrderEntity } from "src/modules/orders/order/order.entity";
import { OrderModule } from "src/modules/orders/order/order.module";

@Module({
    imports:[
        // forwardRef(() => OrderModule),
       TypeOrmModule.forFeature([UserEntity, AccountEntity, OrderEntity]),
       AccountModule,
    //    forwardRef(() => OrderModule),
    ],
    controllers: [UserController],
    providers: [
        {
            provide: 'IUserService',
            useClass: UserService,
        },
    ],
    exports: ['IUserService',]
})
export class UserModule {}