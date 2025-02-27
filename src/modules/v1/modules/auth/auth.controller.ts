import { Body, Controller, HttpCode, Inject, Param, Post, UseGuards } from '@nestjs/common'

import { IAuthService } from './auth.service.interface'

import { RegisterCustomerDto } from './dto/register-customer.dto'
import { TokensDto } from './dto/token.dto'
import { AuthDto } from './dto/auth.dto'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { RegisterDto } from './dto/register.dto'
import { ManagerRoleGuard } from '../../guards/manager.role.guard'
import { Public } from '../../decorators/public.decorator'
import { CreateEmployeePipeValidator } from '../../pipes/create-employee.validator.pipe'

@Controller('/v1/auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService // private useService: UserService
  ) {}

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(@Body() input: RegisterCustomerDto): Promise<TokensDto | object> {
    const result = await this.authService.registerCustomer(input)
    console.log(result)
    return result
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() login: AuthDto) {
    console.log(`<USER> ::: ${login.email} Đã vừa đăng nhập!`)
    return await this.authService.login(login)
  }

  // @Public()
  @UseGuards(ManagerRoleGuard)
  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() data: { email: string }) {
    //: Promise<TokensDto | object>
    console.log(data.email)
    const res = await this.authService.verifyEmail(data.email)
    return res
  }

  @Public()
  @HttpCode(200)
  @Post('send-email')
  async sendEmail(@Body() data: { email: string }) {
    try {
      // const res =
      await this.authService.sendMail(data.email, 'SEND MAIL', 'Test Send Mail')
      return 0
    } catch (error) {
      throw new Error(`send mail Thất bại. ${error}`)
    }
    // return res; // 1: email || 2: message
  }

  @Public()
  @Post('/admin/login')
  @HttpCode(200)
  async loginAdmin(@Body() login: AuthDto) {
    console.log(`<ADMIN> ::: ${login.email} Đã vừa đăng nhập!`)
    return await this.authService.loginAdmin(login)
  }

  // @Post('logout')
  // async logout(@Request() req: any){
  //     const kq = await this.authService.logout(req['email']);
  //     if (kq == true)
  //     return {message: "Ban da dang xuat!"};
  // }

  @UseGuards(ManagerRoleGuard)
  @Post('register-employee/:email') // check login hoặc chưa
  //@UsePipes(new CreateEmployeePipeValidator())
  async registerEmployee(
    @Param('email') email: string,
    @Body(new CreateEmployeePipeValidator()) data: CreateEmployeeDto
  ): Promise<TokensDto | object> {
    //@Body() input: RegisterDto

    const position_id = parseInt(data.position_id, 10)
    const result = await this.authService.createEmployee(email, position_id, data)
    return result
  }

  // @Public()
  @Post('register-employee')
  @HttpCode(200)
  async testCreateAccount(@Body() input: RegisterDto): Promise<TokensDto | object> {
    return await this.authService.registerEmployee(input)
  }
}

// @Public()
// @Post('verify-otp') // check login hoặc chưa
// async checkOTP(@Body() data: { otp: string }){//: Promise<TokensDto | object> {
//     console.log("checOtp:::", data.otp)
//     const res = await this.authService.checkOTP(data.otp);
//     return res
// }
