import { Injectable } from '@nestjs/common';
import { IAccountService } from './account.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { Repository } from 'typeorm';
import { AbstractBaseService } from 'src/common/bases/base.abstract.service';

@Injectable()
export class AccountService
  extends AbstractBaseService<AccountEntity>
  implements IAccountService
{
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {
    super(accountRepository);
  }
  findByEmail(email: string): Promise<AccountEntity> {
    throw new Error('Method not implemented.');
  }

  async deleteAccountFail(email: string) {
    try {
      const getAccountFailed = await this.getOneById(email);
      await this.accountRepository.delete(getAccountFailed.email);
      return true;
    } catch (error) {
      console.log(`Xóa Account Fail thất bại. :::: ${error}`);
    }
  }
}
