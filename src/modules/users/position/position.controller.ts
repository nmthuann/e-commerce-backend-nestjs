import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { PositionDto } from '../position/position.dto';
import { IPositionService } from './position.service.interface';
import { PositionEntity } from './position.entity';

// working with DTO
@Controller('position')
export class PositionController {
  constructor(
    @Inject('IPositionService')
    private positionService: IPositionService,
  ) {}

  // @Guard(AdminGuard)
  @Post('create')
  async createPosition(@Body() position: PositionDto): Promise<PositionEntity> {
    return await this.positionService.createOne(position);
  }

  @Put('update/:id')
  async updatePositionById(
    @Param('id') id: number,
    @Body() positionDto: PositionDto,
  ): Promise<PositionEntity> {
    return this.positionService.updateOneById(id, positionDto);
  }

  @Delete('delete/:id')
  async deletePositionById(@Param('id') id: number): Promise<void> {
    console.log(await this.positionService.deleteOneById(id));
  }

  @Get('get-positions')
  async getPositions(): Promise<PositionEntity[]> {
    return await this.positionService.getAll();
  }

  @Get(':id')
  async getPosition(@Param('id') id: number): Promise<PositionEntity> {
    return await this.positionService.getOneById(id);
  }
}
