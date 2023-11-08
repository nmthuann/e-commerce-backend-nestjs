import { Payload } from '../bases/types/payload.type';
import { Tokens } from '../bases/types/token.type';
import { AccountEntity } from '../users/account/account.entity';
import { AuthDto } from './auth-dto/auth.dto';
import { CreateEmployeeDto } from './auth-dto/create-employee.dto';
import { RegisterCustomerDto } from './auth-dto/register-customer.dto';
import { RegisterDto } from './auth-dto/register.dto';
import { TokensDto } from './auth-dto/token.dto';

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, storePasswordHash: string): Promise<any>;
  getTokens(payload: Payload): Promise<Tokens>;
  randomPassword(length: number, base: string): string;
  login(input: AuthDto): Promise<Tokens | object | any>;
  loginAdmin(input: AuthDto): Promise<Tokens | object | any>;
  logout(email: string): Promise<boolean>;
  registerCustomer(input: RegisterCustomerDto): Promise<TokensDto | object>;
  registerEmployee(input: RegisterDto): Promise<AccountEntity>;
  verifyEmail(email: string): Promise<unknown>;
  sendMail(receiver: string, subject: string, content: string);
  createEmployee(email: string, position_id: number, data: CreateEmployeeDto);
}
