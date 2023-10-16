import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./auth-dto/register.dto";
import { TokensDto } from "./auth-dto/token.dto";
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto, CheckOTPDto } from "./auth-dto/auth.dto";
import { UserService } from "../users/user/user.service";
import { AuthException } from "src/common/exception-filter/exceptions/auth.exception";
import { AuthExceptionMessages } from "src/common/errors/auth.error";
import { AuthMessage } from "src/common/messages/auth.message";
import { verify } from "crypto";
import { IAuthService } from "./auth.service.interface";
import { ManagerRoleGuard } from "src/common/guards/manager.role.guard";
import { CreateEmployeePipeValidator } from "src/common/pipes/create-employee.validator.pipe";
import { CreateEmployeeDto } from "./auth-dto/create-employee.dto";



@Controller('auth')
export class AuthController  {

  constructor(
     @Inject('IAuthService')
    private authService: IAuthService,
    // private useService: UserService
  ) {}
 
    @Public()
    @Post('register') // check login hoặc chưa
    async register(@Body() input: RegisterDto): Promise<TokensDto | object> {
        return await this.authService.register(input);
    }


    @Public()
    @HttpCode(200)
    @Post('verify-email')
    async verifyEmail(@Body() data: { email: string }) { //: Promise<TokensDto | object>
        try {
            const res = await this.authService.verifyEmail(data.email);
            return res; // 1: email || 2: message
        } catch (error) {
            throw new AuthException(AuthExceptionMessages.VERIFY_MAIL_FAILED);
        }
    }


    @Public()
    @HttpCode(200)
    @Post('send-email')
    async sendEmail(@Body() data: { email: string }) { //: Promise<TokensDto | object>
        
        try {
            const res = await this.authService.sendMail(data.email, 'SEND MAIL', 'Test Send Mail');
            return 0;
        } catch (error) {
            
            throw new Error(`send mail Thất bại. ${error}`)
        }
        // return res; // 1: email || 2: message
    }


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
        return await this.authService.login(login);
        // try {
        //     const verifyLogin = await this.authService.login(login);
        //     // const userInfo = await this.useService.getUserByEmail(login.email);
        //     return  {
        //         verifyLogin,
        //         // "user": userInfo,
        //         "message": AuthMessage.LOGIN_SUCCESS,
        //     }
        // } catch (error) {
        //     throw new HttpException({
        //     status: HttpStatus.BAD_REQUEST,
        //     error: AuthExceptionMessages.LOGIN_FAILED,
        //     }, HttpStatus.BAD_REQUEST, {
        //         cause: error
        //     });
        // }
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


    // @UseGuards(ManagerRoleGuard)
    @Post('register-employee/:email') // check login hoặc chưa
    //@UsePipes(new CreateEmployeePipeValidator())
    async registerEmployee( 
        @Param('email') email: string,  
        @Body(new CreateEmployeePipeValidator()) data: CreateEmployeeDto
    ): Promise<TokensDto | object> { //@Body() input: RegisterDto
        
        const position_id = parseInt(data.position_id, 10);
        const result  = await this.authService.createEmployee(email, position_id, data);
        return result;
    }
}