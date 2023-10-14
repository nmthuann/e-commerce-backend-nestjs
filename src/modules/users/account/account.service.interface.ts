import { IBaseService } from "src/modules/bases/base.interface";
import { AccountDto } from "./account-dto/account.dto";
import { AccountEntity } from "./account.entity";
import { AccountForEmployeeDto } from "./account-dto/account-employee.dto";

export interface IAccountService extends IBaseService<AccountEntity>{
    deleteAccountFail(email: string);
    // createAccountForEmployee(data: AccountForEmployeeDto): Promise<AccountEntity>;
}