import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { IPositionService } from '../services/position.service.interface'

@ApiTags('Positions')
@Roles(Role.ADMIN)
@Controller('positions')
export class PositionController {
  constructor(
    @Inject('IPositionService')
    private readonly positionService: IPositionService
  ) {}

  @Get()
  async getAll() {
    return await this.positionService.getAll()
  }
}
