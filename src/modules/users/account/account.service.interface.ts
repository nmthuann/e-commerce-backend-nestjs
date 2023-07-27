import { IBaseService } from "src/modules/bases/base.interface";
import { AccountDto } from "./account-dto/account.dto";

export interface IAccountService extends IBaseService<AccountDto>{
}