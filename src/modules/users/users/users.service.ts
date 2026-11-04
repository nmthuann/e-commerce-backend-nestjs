import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { PageMetaDto } from 'src/common/dto/page-meta.dto'
import { PageDto } from 'src/common/dto/page.dto'
import { AuthError, UserError } from 'src/common/enums/errors.enum'
import { UserStatus } from 'src/common/enums/user-status.enum'
import { comparePassword, hashPassword } from 'src/common/utils/password.util'
import { ChangePasswordDto, GetUsersQueryDto, UpdateProfileDto } from './user.dto'
import { UserEntity } from './user.entity'

export type CreateUserData = Pick<UserEntity, 'email' | 'passwordHash' | 'fullName' | 'role'> &
  Partial<Pick<UserEntity, 'phone'>>

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { employee: { position: true } }
    })
    if (!user) throw new NotFoundException(UserError.USER_NOT_FOUND)
    return user
  }

  // Có kèm passwordHash + refreshTokenHash — chỉ dùng nội bộ cho xác thực
  findWithSecrets(where: { id: string } | { email: string }): Promise<UserEntity | null> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.passwordHash', 'user.refreshTokenHash'])
      .leftJoinAndSelect('user.employee', 'employee')
      .leftJoinAndSelect('employee.position', 'position')

    return 'id' in where
      ? qb.where('user.id = :id', { id: where.id }).getOne()
      : qb.where('user.email = :email', { email: where.email.trim().toLowerCase() }).getOne()
  }

  emailExists(email: string, manager?: EntityManager): Promise<boolean> {
    const repository = manager ? manager.getRepository(UserEntity) : this.userRepository
    return repository.exists({ where: { email: email.trim().toLowerCase() } })
  }

  async create(data: CreateUserData, manager?: EntityManager): Promise<UserEntity> {
    const repository = manager ? manager.getRepository(UserEntity) : this.userRepository
    const { id } = await repository.save(repository.create(data))
    // Đọc lại qua cùng repository (có thể nằm trong transaction) để không trả về passwordHash
    return repository.findOneOrFail({ where: { id }, relations: { employee: { position: true } } })
  }

  async setRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.userRepository.update({ id }, { refreshTokenHash })
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<UserEntity> {
    await this.findById(id)
    await this.userRepository.update({ id }, data)
    return this.findById(id)
  }

  async changePassword(id: string, data: ChangePasswordDto): Promise<void> {
    const user = await this.findWithSecrets({ id })
    if (!user) throw new NotFoundException(UserError.USER_NOT_FOUND)
    if (!(await comparePassword(data.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException(AuthError.WRONG_PASSWORD)
    }
    // Đổi mật khẩu → thu hồi refresh token, buộc đăng nhập lại trên các thiết bị khác
    await this.userRepository.update({ id }, { passwordHash: await hashPassword(data.newPassword), refreshTokenHash: null })
  }

  async findAll(query: GetUsersQueryDto): Promise<PageDto<UserEntity>> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.employee', 'employee')
      .leftJoinAndSelect('employee.position', 'position')

    if (query.q) {
      qb.andWhere('(user.email ILIKE :q OR user.fullName ILIKE :q OR user.phone ILIKE :q)', { q: `%${query.q}%` })
    }
    if (query.role) qb.andWhere('user.role = :role', { role: query.role })
    if (query.status) qb.andWhere('user.status = :status', { status: query.status })

    const [users, itemCount] = await qb
      .orderBy('user.createdAt', query.order ?? 'DESC')
      .skip(query.skip)
      .take(query.take)
      .getManyAndCount()

    return new PageDto(users, new PageMetaDto({ pageOptionsDto: query, itemCount }))
  }

  async updateStatus(actorId: string, id: string, status: UserStatus): Promise<UserEntity> {
    if (actorId === id) throw new BadRequestException(UserError.CANNOT_CHANGE_OWN_STATUS)
    await this.findById(id)
    await this.userRepository.update(
      { id },
      // Khóa / ngừng tài khoản → thu hồi refresh token ngay
      status === UserStatus.ACTIVE ? { status } : { status, refreshTokenHash: null }
    )
    return this.findById(id)
  }
}
