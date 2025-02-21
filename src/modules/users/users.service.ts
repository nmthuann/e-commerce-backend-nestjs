import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from './entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
    ) {
    }

    async getPositions(): Promise<PositionEntity[]> {
        return await this.positionRepository.find();
    }

}
