import { IBaseService } from 'src/modules/bases/base.interface';
import { AccountEntity } from './account.entity';

export interface IAccountService extends IBaseService<AccountEntity> {
  deleteAccountFail(email: string);
  // createAccountForEmployee(data: AccountForEmployeeDto): Promise<AccountEntity>;
}
