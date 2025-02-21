import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { EmployeeEntity } from './entities/employee.entity';

@Controller('users')
export class UsersController {

constructor(
    private readonly usersService: UsersService,
  ) {}

    @Get('positions')
    async getPositions(): Promise<EmployeeEntity[]> {
      return await this.usersService.getPositions();
    }
}
