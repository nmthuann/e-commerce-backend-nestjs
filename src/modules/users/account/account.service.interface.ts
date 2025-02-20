import { IBaseService } from 'src/common/bases/base.interface';
import { AccountEntity } from './account.entity';

export interface IAccountService extends IBaseService<AccountEntity> {
  deleteAccountFail(email: string);
}
