import { Body, Controller, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./auth-dto/register.dto";
import { TokensDto } from "./auth-dto/token.dto";
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto, CheckOTPDto } from "./auth-dto/auth.dto";



@Controller('auth')
export class AuthController  {

  constructor(
    private authService: AuthService,
  ) {}
 
    @Public()
    @Post('register') // check login hoặc chưa
    async register(@Body() input: RegisterDto): Promise<TokensDto | object> {
        return await this.authService.register(input);
    }


    @Post('verify-email/:email') // check login hoặc chưa
    async verifyEmail(@Param('email') email: string): Promise<TokensDto | object> {
        return await this.authService.verifyEmail(email);
    }

    @Post('check-otp') // check login hoặc chưa
    async checkOTP(@Body() checOtp:CheckOTPDto ): Promise<TokensDto | object> {
        return await this.authService.checkOTP(checOtp.email, checOtp.otp);
    }
  
    //@Public()
    @Post('login')
    async login(@Body() login: AuthDto): Promise<TokensDto> {
        console.log(login, "Đã vừa đăng nhập!")
        return await this.authService.login(login);
    }


    // @Post('logout')
    // async logout(@Request() req: any){
    //     const kq = await this.authService.logout(req['email']);
    //     if (kq == true)
    //     return {message: "Ban da dang xuat!"};
    // }
}