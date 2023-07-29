import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "./account.entity";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

@Module({
    imports:[
       TypeOrmModule.forFeature([AccountEntity])
    ],
    controllers: [AccountController],
    providers: [
        {
            provide: 'IAccountService',
            useClass: AccountService,
        },
    ],
    exports: ['IAccountService',]
})
export class AccountModule {}