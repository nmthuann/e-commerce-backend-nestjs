import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';

import { IUserService } from './user.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IAccountService } from '../account/account.service.interface';

import { EmployeeEntity } from '../employee/employee.entity';

@Injectable()
export class UserService
  extends BaseService<UserEntity>
  implements IUserService
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject('IAccountService')
    private accountService: IAccountService,
  ) {
    super(userRepository);
  }

  // async createOne(data: CreateUserDto): Promise<UserEntity> {
  //   try {
  //     const createAccount = await this.authService.registerEmployee({
  //       email: data.account,
  //       password: '123456'
  //     })

  //     const newUser = new UserEntity()
  //     newUser.address = data.address;
  //     newUser.avatar_url = data.avatar_url;
  //     newUser.birthday = data.birthday;
  //     newUser.first_name = data.first_name;
  //     newUser.last_name = data.last_name;
  //     newUser.gender = data.gender;
  //     newUser.phone = data.phone;
  //     newUser.account = createAccount;

  //     const createUser = await this.userRepository.save(newUser);
  //     return createUser;

  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }
  // }

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

  // async createOne(data: UserDto): Promise<UserEntity> {

  //   const findAccount = await this.accountService.getOneById()
  //   return;
  // }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const findUser = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .leftJoinAndSelect('users.employee', 'employee')
      .getOne();
    // console.log((await Promise.resolve(findUser)).employee.employee_id  )
    // const employee = (await Promise.resolve(findUser)).employee;
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
