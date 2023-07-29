import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { AccountDto } from "./account-dto/account.dto";
import { IAccountService } from "./account.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "./account.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountService extends BaseService<AccountDto> implements IAccountService {
  constructor(
    @InjectRepository(AccountEntity) 
    private accountRepository: Repository<AccountDto>) {
        super(accountRepository);
    }
}