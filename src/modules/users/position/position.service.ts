import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IPositionService } from './position.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from './position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService
  extends BaseService<PositionEntity>
  implements IPositionService
{
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {
    super(positionRepository);
  }
}
