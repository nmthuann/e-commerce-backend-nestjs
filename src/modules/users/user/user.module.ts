import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AccountEntity } from "../account/account.entity";
import { AccountModule } from "../account/account.module";

@Module({
    imports:[
       TypeOrmModule.forFeature([UserEntity, AccountEntity]),
       AccountModule
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