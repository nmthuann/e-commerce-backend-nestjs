import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IUserService } from './user.service.interface'

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService
  ) {}

  @Get()
  async getData(@Query('email') email: string) {
    console.log(typeof email)
    return await this.userService.getOneByEmail(email)
  }
}
