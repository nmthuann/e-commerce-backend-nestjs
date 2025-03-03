import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { IUserService } from '../services/user.service.interface'
import { UserRoleGuard } from 'src/guards/user-role.guard'

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
  async getProfile() {
    console.log('Get Profile')
    return 'Thông tin user'
  }
}
