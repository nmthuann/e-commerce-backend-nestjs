import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Positions, Roles } from 'src/common/decorators/roles.decorator';
import { PageDto } from 'src/common/dto/page.dto';
import { Position, Role } from 'src/common/enums/role.enum';
import { GetUsersQueryDto, UpdateUserStatusDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('Admin - Users')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  /** Danh sách người dùng (ADMIN; SALES chỉ xem) */
  @Get()
  @Positions(Position.SALES)
  findAll(@Query() query: GetUsersQueryDto): Promise<PageDto<UserEntity>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Positions(Position.SALES)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  /** Khóa / mở khóa tài khoản */
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(
    @CurrentUser('sub') actorId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserStatusDto,
  ): Promise<UserEntity> {
    return this.userService.updateStatus(actorId, id, data.status);
  }
}
