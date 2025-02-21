import { Tokens } from '../../common/types/token.type';
import { AccountEntity } from '../users/account/account.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './dto/responses/login.response';
import { TokensDto } from './dto/token.dto';

export interface IAuthService {
  login(data: LoginDto): Promise<LoginResponse>
  register(data: RegisterDto): Promise<LoginResponse>
  login(input: AuthDto): Promise<Tokens | object>;
  loginAdmin(input: AuthDto): Promise<Tokens | object>;
  logout(email: string): Promise<boolean>;
  registerCustomer(input: RegisterCustomerDto): Promise<TokensDto | object>;
  registerEmployee(input: RegisterDto): Promise<AccountEntity>;
  verifyEmail(email: string): Promise<unknown>;
  sendMail(receiver: string, subject: string, content: string);
  createEmployee(email: string, position_id: number, data: CreateEmployeeDto);
}
