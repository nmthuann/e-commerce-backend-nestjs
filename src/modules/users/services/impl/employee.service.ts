import { Injectable, NotFoundException } from '@nestjs/common'
import { IEmployeeService } from '../employee.service.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { EmployeeEntity } from '../../domain/entities/employee.entity'
import { Repository } from 'typeorm'
import { EmployeeDto } from '../../domain/dtos/employee.dto'
import { UserEntity } from '../../domain/entities/user.entity'
import { PositionDto } from '../../domain/dtos/position.dto'

@Injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getOneByUserId(userId: string): Promise<EmployeeDto> {
    const findUser = await this.userRepository.findOne({ where: { id: userId } })

    if (!findUser) {
      throw new NotFoundException('User not found')
    }

    const findEmp = await this.employeeRepository.findOne({
      where: { user: { id: userId } },
      relations: ['position']
    })

    if (!findEmp) {
      throw new NotFoundException('Employee not found')
    }

    if (!findEmp.workStatus) {
      throw new NotFoundException('Employee is Invalid')
    }

    return {
      id: findEmp.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      avatarUrl: findUser.avatarUrl,
      gender: findUser.gender,
      phone: findUser.phone,
      birthday: findUser.birthday,
      address: findEmp.address,
      salary: findEmp.salary,
      workStartDate: findEmp.workStartDate,
      workStatus: findEmp.workStatus,
      position: new PositionDto(findEmp.position)
    }
  }
}
