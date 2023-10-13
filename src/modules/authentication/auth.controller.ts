import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./auth-dto/register.dto";
import { TokensDto } from "./auth-dto/token.dto";
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto, CheckOTPDto } from "./auth-dto/auth.dto";
import { UserService } from "../users/user/user.service";
import { AuthException } from "src/common/exception-filter/exceptions/auth.exception";
import { AuthExceptionMessages } from "src/common/errors/auth.error";
import { AuthMessage } from "src/common/messages/auth.message";



@Controller('auth')
export class AuthController  {

  constructor(
    private authService: AuthService,
    // private useService: UserService
  ) {}
 
    @Public()
    @Post('register') // check login hoặc chưa
    async register(@Body() input: RegisterDto): Promise<TokensDto | object> {
        return await this.authService.register(input);
    }


    // @Public()
    // @Post('verify-email') // check login hoặc chưa
    // async verifyEmail(@Body() data: { email: string }) { //: Promise<TokensDto | object>
    //     console.log("verify-email:",data.email);
    //     const res = await this.authService.verifyEmail(data.email);
    //     return res; // 1: email || 2: message

    //     // try {
                
    //     // } catch (error) {
            
    //     // }
    // }

    // @Public()
    // @Post('verify-otp') // check login hoặc chưa
    // async checkOTP(@Body() data: { otp: string }){//: Promise<TokensDto | object> {
    //     console.log("checOtp:::", data.otp)
    //     const res = await this.authService.checkOTP(data.otp);
    //     return res
    // }
  
    @Public()
    @Post('login')
    @HttpCode(200)
    async login(@Body() login: AuthDto){
        const verifyLogin = await this.authService.login(login);
        if (verifyLogin){
            //throw new AuthException(AuthExceptionMessages.PASSWORD_WRONG);
           // const userInfo = await this.useService.getUserByEmail(login.email);
            return  {
                verifyLogin,
                // "user": userInfo,
                "message": AuthMessage.LOGIN_SUCCESS,
            }
        }
        
    //     return {
    //   token: accessToken,
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //   },
    //   message: 'Login successful',
    // };
    }


    @Public()
    @Post('/admin/login')
    async loginAdmin(@Body() login: AuthDto){   
        console.log(login, "Đã vừa đăng nhập!")
        return await this.authService.loginAdmin(login);
    }


    // @Post('logout')
    // async logout(@Request() req: any){
    //     const kq = await this.authService.logout(req['email']);
    //     if (kq == true)
    //     return {message: "Ban da dang xuat!"};
    // }



    @Post('register-employee') // check login hoặc chưa
    async registerEmployee(@Body() input: RegisterDto): Promise<TokensDto | object> {
        return await this.authService.registerEmployee(input);
    }
}