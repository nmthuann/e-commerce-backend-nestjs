import { Controller, Get, Inject, Query, UseGuards, Request } from '@nestjs/common'
import { IUserService } from '../services/user.service.interface'
import { UserRequest } from '../domain/dtos/request/user.request'
import { CommonRoleGuard } from 'src/guards/common-role.guard'

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

  @Get('me')
  @UseGuards(CommonRoleGuard)
  async getProfile(@Request() req: UserRequest) {
    console.log('Thông tin Profile User:', req.userId)
    return await this.userService.getOneById(req.userId)
  }
}
