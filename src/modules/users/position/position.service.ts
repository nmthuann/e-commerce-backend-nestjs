import { Injectable } from '@nestjs/common';
import { IPositionService } from './position.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from './position.entity';
import { Repository } from 'typeorm';
import { AbstractBaseService } from 'src/common/bases/base.abstract.service';

@Injectable()
export class PositionService
  extends AbstractBaseService<PositionEntity>
  implements IPositionService
{
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {
    super(positionRepository);
  }
}
