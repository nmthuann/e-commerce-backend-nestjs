import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { UserDto } from "./user-dto/user.dto";
import { IUserService } from "./user.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { IAccountService } from "../account/account.service.interface";

@Injectable()
export class UserService extends BaseService<UserDto> implements IUserService {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepository: Repository<UserDto>,
    @Inject('IAccountService')
    private accountService: IAccountService,
    ) {
      super(userRepository);
    }

 

  async createOne(user: UserDto): Promise<UserDto> {
    try{
      const findAccount = 
        await this.accountService.getOneById(user.account.email);
        return await this.userRepository.save({...findAccount, ...user});
    }catch (error) {
      throw new Error(`An unexpected error occurred while creating the user ${error}`);
    }
  }

  async createEmployee(data: UserDto): Promise<UserDto> {
    return;    
  }
}