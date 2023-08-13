import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {  Inject, Injectable } from "@nestjs/common"; //CACHE_MANAGER,
import { Cache } from 'cache-manager';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { IAccountService } from "src/modules/users/account/account.service.interface";
import { RegisterDto } from "./auth-dto/register.dto";
import { TokensDto } from "./auth-dto/token.dto";
import { Payload } from "src/modules/bases/types/payload.type";
import { Tokens } from "src/modules/bases/types/token.type";
import { Role } from "src/modules/bases/enums/role.enum";
import { AccountDto } from "src/modules/users/account/account-dto/account.dto";
import { AuthDto } from "./auth-dto/auth.dto";
import { IsEmail } from "class-validator";
import { AccountEntity } from "src/modules/users/account/account.entity";



@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: Cache,
        private jwtService: JwtService, 
        @Inject('IAccountService')
        private accountService: IAccountService,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        //console.log(await bcrypt.hash(password, 10))
        return await (bcrypt.hash(password, '10'));
    }


    private async comparePassword(
        password: string,
        storePasswordHash: string,
        ): Promise<any> {
        return await bcrypt.compare(password, storePasswordHash);
    }


    // gettoken -> [access,refresh] -> create sign
    private async getTokens(payload: Payload): Promise<Tokens> {
        const [jwt, refresh] = await Promise.all([
        this.jwtService.signAsync({payload}, {
            secret: 'JWT_SECRET_KEY',
            expiresIn: 60*15,
        }),
        this.jwtService.signAsync({payload}, {
            secret: 'REFRESH_JWT_SECRET_KEY',
            expiresIn: 60*60,// 60 * 60 * 24
        })
        ]);

        return {
            access_token: jwt,
            refresh_token: refresh
        }
    }


  // hàm random password
    private randomPassword(length: number, base: string): string{
        //const baseString = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        const getRandomInt = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };
        let result = "";
        const baseLength = base.length;
        for (let i = 0; i < length; i++) {
            const randomIndex = getRandomInt(0, baseLength);
            result += base[randomIndex];
        }
        return result as string;
    }

    async verifyEmail (email: string): Promise<string | any>{
        const checkUser = await this.accountService.getOneById(email);
        if (checkUser) {
            // throw new HttpException(
            // { message: 'User already exists' },
            //   HttpStatus.BAD_REQUEST,
            // );
            return {message: 'User already exists'}
        }

        // tạo OTP
        const baseString ="0123456789qwertyuiopasdfghjklzxcvbnm";
        const otp = this.randomPassword(6, baseString)
        console.log(`OTP: ${otp}`);
        // lưu cache
        
        await this.cacheService.set(String(otp), String(email), 300); // 5phut
        return email;
    }


    async checkOTP (otp: string){
        // == in cache
        try {
            const emailInCache: string = await this.cacheService.get(String(otp));
            if (emailInCache){ // đúng
                await this.cacheService.del(String(otp));  // xóa cache
                return {
                    message: "success",
                    email: String(emailInCache)
                }
            } 
            else{
                await this.cacheService.del(String(otp));
                return {message: "failed"}
            }
            
        } catch (error) {   
            throw new Error(`An unexpected error:: ${error}`);
        }  
    }

    // đăng kí tài khoản -> Done!
    public async register(input: RegisterDto): Promise<TokensDto | object> {
        
        input.password = await bcrypt.hash(input.password, 12); // hash pass
        // create account
        const newUser = await this.accountService.createOne(input);

        const tokens = await this.getTokens({
            email: newUser.email,
            role: Role.User
        });

        const update = new AccountDto(
            newUser.email,     
            true,
            tokens.refresh_token,
            newUser.password,
            Role.User,
            null
        );

        await this.accountService.updateOneById(newUser.email, update)
        console.log(newUser);

        //const accessTokenDto = new AccessTokenDto(tokens.access_token);
        return tokens;
    }




      // đăng nhập 
    public async login(input: AuthDto): Promise<Tokens | object | any> {
        // const checkUser = await this.accountUserService.CheckEmailExsit(input.email);
        const findUser: AccountEntity = await this.accountService.getOneById(input.email);
        console.log(findUser)
        if (findUser){
        const checkPass = await this.comparePassword(input.password, findUser.password);
            if (!checkPass) {
                console.log('password wrong!')
                return {message: 'password wrong!'}
            }
        } 
        else{
            return {message: 'email or Password Invalid!'}
        }
        return 0

    //     // write infor put in Payload
    //     const payload: Payload = {
    //         email: input.email,
    //         role: findUser.role
    //     };

    //     const tokens: Tokens = await this.getTokens(payload);
    //     findUser.refresh_token = tokens.refresh_token;
    //     await this.accountService.updateOneById(findUser.email, findUser);
    //     console.log(`message: ${input.email} đăng nhập thành công!`)
    //     return tokens;
    // }
    }

    // logout -> refresh token = null -> delete cache
    public async logout(email: string): Promise<boolean> {
        const checkUser = await this.accountService.getOneById(email);
        checkUser.refresh_token = null;
        await this.accountService.updateOneById(checkUser.email, checkUser);
        console.log(`${email} da dang xuat!`);
        return true;
    }






    // đăng kí tài khoản -> Done!
    public async registerEmployee(input: RegisterDto): Promise<TokensDto | object> {
        
        input.password = await bcrypt.hash(input.password, 12); // hash pass
        // create account
        const newUser = await this.accountService.createOne(input);

        const tokens = await this.getTokens({
            email: newUser.email,
            role: Role.Admin
        });

        const update = new AccountDto(
            newUser.email,     
            true,
            tokens.refresh_token,
            newUser.password,
            Role.Admin,
            null
        );

        await this.accountService.updateOneById(newUser.email, update)
        console.log(newUser);

        //const accessTokenDto = new AccessTokenDto(tokens.access_token);
        return tokens;
    }





          // đăng nhập 
    public async loginAdmin(input: AuthDto): Promise<Tokens | object | any> {
        const findUser: AccountDto = await this.accountService.getOneById(input.email);
        if(findUser.role == Role.User){
            return {message: 'You are not Admin!'}
        }
        if (findUser){
        const checkPass = await this.comparePassword(input.password, findUser.password);
        console.log("checkPass",checkPass)
            if (!checkPass) {
                console.log('password wrong!')
                return {message: 'password wrong!'}
            }
        } 
        else{
            return {message: 'email or Password Invalid!'}
        }

        // write infor put in Payload
        const payload: Payload = {
            email: input.email,
            role: findUser.role
        };

        const tokens: Tokens = await this.getTokens(payload);
        findUser.refresh_token = tokens.refresh_token;
        await this.accountService.updateOneById(findUser.email, findUser);
        console.log(`message: ${input.email} đăng nhập thành công!`)
        return tokens;
    }

}