import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { IUserService } from '../services/user.service.interface'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService
  ) {}

  // TODO(P2.3): chuyển sang GET /admin/users
  @Get()
  @Roles(Role.ADMIN)
  async getData(@Query('email') email: string) {
    return await this.userService.getOneByEmail(email)
  }

  @Get('me')
  async getProfile(@CurrentUser('sub') userId: string) {
    return await this.userService.getOneById(userId)
  }
}
