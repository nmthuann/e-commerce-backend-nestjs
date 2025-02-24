import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { AccountEntity } from './account.entity';

export interface IAccountService extends IBaseService<AccountEntity> {
  deleteAccountFail(email: string);
  findByEmail(email: string): Promise<AccountEntity>;
}
