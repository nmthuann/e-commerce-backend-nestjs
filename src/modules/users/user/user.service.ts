import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { UserDto } from "./user-dto/user.dto";
import { IUserService } from "./user.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { IAccountService } from "../account/account.service.interface";
import { AccountEntity } from "../account/account.entity";

@Injectable()
export class UserService extends BaseService<UserEntity> implements IUserService {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepository: Repository<UserEntity>,
    // @Inject('IAccountService')
    // private accountService: IAccountService,
  ) {
    super(userRepository);
  }


  async getOneById(id: string | number ): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        user_id: id as number,
      },
      relations: {
        account: true,
        employee: true,
      },
    })
    return findUser;
  }

  
  async getUsersIsEmployee(): Promise<UserEntity[]> {
    const findEmployees = await this.userRepository.find({
      relations: {
        employee: true
      }
    })
    return findEmployees;
  }

  async createEmployee(data: UserDto): Promise<UserDto> {
    return;    
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const findUser = await this.userRepository
    .createQueryBuilder("users")
    .where("users.email = :email", { email: email})
    .leftJoinAndSelect('users.employee', 'employee')
    .getOne()
    return findUser;
  }
}