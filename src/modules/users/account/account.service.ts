import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { AccountDto } from "./account-dto/account.dto";
import { IAccountService } from "./account.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "./account.entity";
import { ObjectId, Repository } from "typeorm";
import { AccountForEmployeeDto } from "./account-dto/account-employee.dto";
// import { async } from "rxjs";

@Injectable()
export class AccountService extends BaseService<AccountEntity> implements IAccountService {
  constructor(
    @InjectRepository(AccountEntity) 
    private accountRepository: Repository<AccountEntity>) {
        super(accountRepository);
  }


  // async createAccountForEmployee(data: AccountForEmployeeDto): Promise<AccountEntity> {

  //   const newAccount = new AccountEntity();
  //   newAccount.email = data.email;


  //     return
  // }


  // async getOneById(email: string): Promise<AccountEntity> {
  //   const accountInstance: AccountDto =  await this.accountRepository.findOneById(email);
    
  //   return accountInstance.toPlainObject();
  // }
}