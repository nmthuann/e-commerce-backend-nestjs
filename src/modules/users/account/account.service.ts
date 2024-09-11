import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IAccountService } from './account.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService
  extends BaseService<AccountEntity>
  implements IAccountService
{
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {
    super(accountRepository);
  }

  async deleteAccountFail(email: string) {
    try {
      const getAccountFailed = await this.getOneById(email);
      await this.accountRepository.delete(getAccountFailed);
      return true;
    } catch (error) {
      console.log(`Xóa Account Fail thất bại. :::: ${error}`);
    }
  }

}
