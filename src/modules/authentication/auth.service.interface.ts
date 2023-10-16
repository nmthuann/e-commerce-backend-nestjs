import { Payload } from "../bases/types/payload.type";
import { Tokens } from "../bases/types/token.type";
import { AccountEntity } from "../users/account/account.entity";
import { AuthDto } from "./auth-dto/auth.dto";
import { CreateEmployeeDto } from "./auth-dto/create-employee.dto";
import { RegisterDto } from "./auth-dto/register.dto";
import { TokensDto } from "./auth-dto/token.dto";


export interface IAuthService{
   
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, storePasswordHash: string,): Promise<any>;
    getTokens(payload: Payload): Promise<Tokens>;
    randomPassword(length: number, base: string): string;
    register(input: RegisterDto): Promise<TokensDto | object>;
    login(input: AuthDto): Promise<Tokens | object | any>;
    logout(email: string): Promise<boolean>;
    registerEmployee(input: RegisterDto): Promise<AccountEntity>;
    loginAdmin(input: AuthDto): Promise<Tokens | object | any>;
    verifyEmail(email: string): unknown;
    sendMail(receiver: string, subject: string, content: string);
    createEmployee(email: string,position_id: number, data: CreateEmployeeDto);
}