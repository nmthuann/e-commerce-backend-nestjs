import { Controller, Get, Inject, Query, UseGuards, Request } from '@nestjs/common'
import { IUserService } from '../services/user.service.interface'
import { UserRoleGuard } from 'src/guards/user-role.guard'
import { UserRequest } from '../domain/dtos/request/user.request'

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
  @UseGuards(UserRoleGuard)
  async getProfile(@Request() req: UserRequest) {
    console.log('Thông tin Profile User:', req.userId)
    return await this.userService.getOneById(req.userId)
  }
}
