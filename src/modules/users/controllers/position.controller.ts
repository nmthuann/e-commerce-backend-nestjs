import { Controller, Get, Inject } from '@nestjs/common'
import { IPositionService } from '../services/position.service.interface'

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
