import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { CreatePositionDto, UpdatePositionDto } from './position.dto'
import { PositionEntity } from './position.entity'
import { PositionsService } from './positions.service'

@ApiTags('Admin - Positions')
@Roles(Role.ADMIN)
@Controller('admin/positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  findAll(): Promise<PositionEntity[]> {
    return this.positionsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PositionEntity> {
    return this.positionsService.findById(id)
  }

  @Post()
  create(@Body() data: CreatePositionDto): Promise<PositionEntity> {
    return this.positionsService.create(data)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePositionDto): Promise<PositionEntity> {
    return this.positionsService.update(id, data)
  }

  /** Chỉ xóa được khi không còn nhân viên nào giữ vị trí này */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.positionsService.remove(id)
  }
}
