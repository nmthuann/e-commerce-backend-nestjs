import { Inject, Injectable } from '@nestjs/common';
import { AbstractBaseService } from 'src/modules/v1/bases/base.abstract.service';
import { IUserService } from './user.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IAccountService } from '../account/account.service.interface';
import { EmployeeEntity } from '../employee/employee.entity';

@Injectable()
export class UserService
  extends AbstractBaseService<UserEntity>
  implements IUserService
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('IAccountService')
    private readonly accountService: IAccountService,
  ) {
    super(userRepository);
  }

  async getOneById(id: string | number): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        user_id: id as number,
      },
      relations: {
        account: true,
        employee: true,
      },
    });
    return findUser;
  }

  async getUsersIsEmployee(): Promise<UserEntity[]> {
    const findEmployees = await this.userRepository.find({
      relations: {
        employee: true,
      },
    });
    return findEmployees;
  }


  async getUserByEmail(email: string): Promise<UserEntity> {
    const findUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .leftJoinAndSelect('users.employee', 'employee')
      .getOne();
    return findUser;
  }

  async getAll(): Promise<UserEntity[]> {
    try {
      const findUsers = await this.userRepository.find({
        relations: {
          account: true,
          employee: true,
        },
      });
      return findUsers;
    } catch (error) {
      console.log(`${error} is Problem`);
      throw error;
    }
  }

  async getEmployeeByEmail(email: string): Promise<EmployeeEntity> {
    const findUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .leftJoinAndSelect('users.employee', 'employee')
      .getOne();
    // console.log((await Promise.resolve(findUser)).employee.employee_id  )
    const employee = (await Promise.resolve(findUser)).employee;
    return employee;
  }
}
