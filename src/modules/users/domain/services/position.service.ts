import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserError } from 'src/common/enums/errors.enum';
import { CreatePositionDto, UpdatePositionDto } from '../dto/position.dto';
import { PositionEntity } from '../entities/position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  findAll(): Promise<PositionEntity[]> {
    return this.positionRepository.find({ order: { id: 'ASC' } });
  }

  async findById(id: number): Promise<PositionEntity> {
    const position = await this.positionRepository.findOneBy({ id });
    if (!position) throw new NotFoundException(UserError.POSITION_NOT_FOUND);
    return position;
  }

  // Trùng code → AllExceptionsFilter trả 409
  create(data: CreatePositionDto): Promise<PositionEntity> {
    return this.positionRepository.save(this.positionRepository.create(data));
  }

  async update(id: number, data: UpdatePositionDto): Promise<PositionEntity> {
    await this.findById(id);
    await this.positionRepository.update({ id }, data);
    return this.findById(id);
  }

  // Vị trí đang có nhân viên → FK RESTRICT → AllExceptionsFilter trả 400
  async remove(id: number): Promise<void> {
    await this.findById(id);
    await this.positionRepository.delete({ id });
  }
}
