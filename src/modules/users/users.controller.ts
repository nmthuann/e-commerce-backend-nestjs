import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { PositionEntity } from './entities/position.entity';

@Controller('users')
export class UsersController {

constructor(
    private readonly usersService: UsersService,
  ) {}

    @Get('positions')
    async getPositions(): Promise<PositionEntity[]> {
      return await this.usersService.getPositions();
    }
}
