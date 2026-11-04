import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  CreatePositionDto,
  UpdatePositionDto,
} from '../dto/position.dto';
import { PositionEntity } from '../entities/position.entity';
import { PositionService } from '../services/position.service';

@ApiTags('Admin - Positions')
@Roles(Role.ADMIN)
@Controller('admin/positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  findAll(): Promise<PositionEntity[]> {
    return this.positionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PositionEntity> {
    return this.positionService.findById(id);
  }

  @Post()
  create(@Body() data: CreatePositionDto): Promise<PositionEntity> {
    return this.positionService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePositionDto,
  ): Promise<PositionEntity> {
    return this.positionService.update(id, data);
  }

  /** Chỉ xóa được khi không còn nhân viên nào giữ vị trí này */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.positionService.remove(id);
  }
}
