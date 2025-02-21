import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';

@Injectable()
export class UsersService {

    constructor(
    @InjectRepository(EmployeeEntity)
    private readonly positionRepository: Repository<EmployeeEntity>,
    ) {
    }

    async getPositions(): Promise<EmployeeEntity[]> {
        return await this.positionRepository.find();
    }

}
