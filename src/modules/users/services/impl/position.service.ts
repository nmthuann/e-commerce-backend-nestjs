import { Injectable } from '@nestjs/common'
import { IPositionService } from '../position.service.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PositionDto } from '../../domain/dtos/position.dto'
import { PositionEntity } from '../../domain/entities/position.entity'

@Injectable()
export class PositionService implements IPositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>
  ) {}

  async getAll(): Promise<PositionDto[]> {
    const positions = await this.positionRepository.find()
    return positions.map(pos => new PositionDto(pos))
  }
}
