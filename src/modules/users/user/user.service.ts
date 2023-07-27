import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { UserDto } from "./user-dto/user.dto";
import { IUserService } from "./user.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService extends BaseService<UserDto> implements IUserService {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepository: Repository<UserDto>) {
        super(userRepository);
    }
}