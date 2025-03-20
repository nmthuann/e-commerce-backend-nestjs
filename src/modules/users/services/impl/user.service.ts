import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../domain/entities/user.entity'
import { IUserService } from '../user.service.interface'
import { UserAuthenticationDto } from '../../domain/dtos/user-authentication.dto'
import { PublicUserDto, UserDto } from '../../domain/dtos/user.dto'
import { UserResponse } from '../../domain/dtos/responses/user.response'

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async getUserByEmployeeId(employeeId: number): Promise<PublicUserDto> {
    const findUser = await this.userRepository.findOne({ where: { employee: { id: employeeId } } })
    if (!findUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với employee Id: ${employeeId}`)
    }
    return {
      // id: findUser.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      avatarUrl: findUser.avatarUrl
    }
  }

  async getOneById(id: string): Promise<UserResponse> {
    const findUser = await this.userRepository.findOne({ where: { id } })
    if (!findUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với email: ${id}`)
    }
    return {
      // id: findUser.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      avatarUrl: findUser.avatarUrl,
      phone: findUser.phone
    }
  }

  async getOneByEmail(email: string): Promise<UserAuthenticationDto> {
    const findUser = await this.userRepository.findOne({ where: { email } })
    if (!findUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với email: ${email}`)
    }

    return {
      id: findUser.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      avatarUrl: findUser.avatarUrl,
      subId: findUser.subId,
      password: findUser.password,
      refreshToken: findUser.refreshToken,
      phone: findUser.phone,
      roleType: findUser.roleType,
      authMethod: findUser.authMethod,
      gender: findUser.gender,
      birthday: findUser.birthday,
      status: findUser.status
    }
  }

  async updateOneById(id: string, data: UserEntity): Promise<UserDto> {
    const findUser = await this.userRepository.findOne({ where: { id } })
    if (!findUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với email: ${id}`)
    }
    return await this.userRepository.save(data)
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const findUser = await this.userRepository.findOne({ where: { id } })
    if (!findUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với email: ${id}`)
    }
    await this.userRepository.update({ id: id }, { refreshToken })
  }
}
