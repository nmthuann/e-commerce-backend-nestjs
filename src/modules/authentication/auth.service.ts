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
import { error } from "console";
import { AuthException } from "src/common/exception-filter/exceptions/auth.exception";
import { AuthExceptionMessages } from "src/common/errors/auth.error";
import { IAuthService } from "./auth.service.interface";
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { AuthMessage } from "src/common/messages/auth.message";
import { GuardError } from "src/common/errors/errors";

dotenv.config(); 


@Injectable()
export class AuthService implements IAuthService{
    constructor(
        // @Inject(CACHE_MANAGER) private cacheService: Cache,
        private jwtService: JwtService, 
        @Inject('IAccountService')
        private accountService: IAccountService,
    ) {}

     async hashPassword(password: string): Promise<string> {
        //console.log(await bcrypt.hash(password, 10))
        return await (bcrypt.hash(password, '10'));
    }


     async comparePassword(
        password: string,
        storePasswordHash: string,
        ): Promise<any> {
        return await bcrypt.compare(password, storePasswordHash);
    }


    // gettoken -> [access,refresh] -> create sign
     async getTokens(payload: Payload): Promise<Tokens> {
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
    randomPassword(length: number, base: string): string{
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
                throw new AuthException(AuthExceptionMessages.PASSWORD_WRONG);
            }
        } 
        else{
            throw new AuthException(AuthExceptionMessages.LOGIN_INVAILD);
        }

        // write infor put in Payload
        const payload: Payload = {
            email: input.email,
            role: findUser.role
        };
        
        const tokens: Tokens = await this.getTokens(payload);
        findUser.refresh_token = tokens.refresh_token;
        await this.accountService.updateOneById(findUser.email, findUser);
        
        return tokens;
    }

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

    // logout -> refresh token = null -> delete cache
    public async logout(email: string): Promise<boolean> {
        const checkUser = await this.accountService.getOneById(email);
        checkUser.refresh_token = null;
        await this.accountService.updateOneById(checkUser.email, checkUser);
        console.log(`${email} da dang xuat!`);
        return true;
    }






    // đăng kí tài khoản -> Done!
    public async registerEmployee(input: RegisterDto): Promise<AccountEntity> { //TokensDto | object
        let newUser: AccountEntity;
        try {

            // hash pass
            input.password = await bcrypt.hash(input.password, 12); 

            // create account
            newUser = await this.accountService.createOne(input);

            const tokens = await this.getTokens({
                email: newUser.email,
                role: Role.Admin
            });

            const updateAccount = new AccountEntity();
            updateAccount.email = newUser.email;
            updateAccount.password = newUser.password;
            updateAccount.refresh_token = tokens.refresh_token;
            updateAccount.role = Role.Admin;
            updateAccount.status = true;
            updateAccount.user = null;

            const createdAccount: AccountEntity = await this.accountService.updateOneById(newUser.email, updateAccount)
            console.log(newUser);

            //const accessTokenDto = new AccessTokenDto(tokens.access_token);
            return createdAccount;
        } catch (error) {
            console.log(`Có lỗi Đăng ký nhân viên :::: ${error} `)
             // Nếu có lỗi, xóa tài khoản đã tạo (nếu đã tạo)
            if (newUser) {
                // Thực hiện xóa tài khoản tại đây
                await this.accountService.deleteAccountFail(newUser.email);
            }
            throw new AuthException(AuthExceptionMessages.REGISTER_EMPLOYEE_FAILED);
        }
    }





    // đăng nhập  - chưa fix
    public async loginAdmin(input: AuthDto): Promise<Tokens | object | any> {
        const findUser: AccountDto = await this.accountService.getOneById(input.email);
        if(findUser.role === Role.User){
            return {message: GuardError.NOT_ADMIN}
        }
        if (findUser){
        const checkPass = await this.comparePassword(input.password, findUser.password);
        console.log("checkPass",checkPass)
            if (!checkPass) {
                console.log('password wrong!')
                return {message: AuthExceptionMessages.PASSWORD_WRONG}
            }
        } 
        else{
            return {message: AuthExceptionMessages.LOGIN_FAILED}
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





    async verifyEmail(email: string): Promise<string | any>{
        const checkUser = await this.accountService.getOneById(email);
        if (checkUser) {
            return {message: AuthExceptionMessages.EMAIL_EXSIT};
        }
        else{
            try {
                const baseString ="0123456789";
                const defaulPassword = this.randomPassword(8, baseString)
                const receiver = email;
                const subject = AuthMessage.SUBJECT_REGISTER_EMAIL;
                const content = `${AuthMessage.CONTENT_REGISTER_EMAIL}: ${defaulPassword}`;
           
                //  Send Mailer -> Success
                const resultSendMail = await this.sendMail(receiver, subject, content);

                if(resultSendMail.message === AuthMessage.SEND_MAIL_SUCCESS){
                    // create account
                    const data  = new RegisterDto(email, defaulPassword);
                    return await this.registerEmployee(data) // hash pass
                }

                // return resultSendMail;
            } catch (error) {
                throw new AuthException(AuthExceptionMessages.VERIFY_MAIL_FAILED);
            }      
        }
        
    }


    async sendMail(receiver: string, subject: string, content: string) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: receiver,
                subject: subject,
                text: content,
            };
            await transporter.sendMail(mailOptions);
            return {message: AuthMessage.SEND_MAIL_SUCCESS}
        } catch (error) {
            // Xử lý lỗi ở đây, ví dụ: ghi log lỗi hoặc thông báo cho người dùng.
            console.error('Gửi email thất bại:', error);
            throw new AuthException(AuthExceptionMessages.SEND_MAIL_FAILED);
        }
    }

}

    


    // async checkOTP (otp: string){
    //     // == in cache
    //     try {
    //         const emailInCache: string = await this.cacheService.get(String(otp));
    //         if (emailInCache){ // đúng
    //             await this.cacheService.del(String(otp));  // xóa cache
            
    //             return {
    //                 message: "success",
    //                 email: String(emailInCache)
    //             }
    //         } 
    //         else{
    //             await this.cacheService.del(String(otp));
    //             return {message: "failed"}
    //         }
            
    //     } catch (error) {   
    //         throw new Error(`An unexpected error:: ${error}`);
    //     }  
    // }



        // async verifyEmail(email: string): Promise<string | any>{
    //     try {
    //          const checkUser = await this.accountService.getOneById(email);
    //         if (checkUser) {
    //             return {message: 'User already exists'};
    //         }
    //         const baseString ="0123456789qwertyuiopasdfghjklzxcvbnm";
    //         const otp = this.randomPassword(6, baseString)
    //         console.log(`OTP: ${otp}`);
    //         // lưu cache
    //         await this.cacheService.set(String(otp), String(email), 300); // 5phut
    //         return email;
    //     } catch (error) {
    //         throw error
    //     }      
    // }