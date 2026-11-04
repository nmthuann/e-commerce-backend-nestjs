import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PageMetaDto } from 'src/common/dto/page-meta.dto'
import { PageDto } from 'src/common/dto/page.dto'
import { AuthError, UserError } from 'src/common/enums/errors.enum'
import { Role } from 'src/common/enums/role.enum'
import { UserStatus } from 'src/common/enums/user-status.enum'
import { hashPassword } from 'src/common/utils/password.util'
import { PositionEntity } from '../positions/position.entity'
import { UserEntity } from '../users/user.entity'
import { UsersService } from '../users/users.service'
import { CreateEmployeeDto, GetEmployeesQueryDto, UpdateEmployeeDto } from './employee.dto'
import { EmployeeEntity } from './employee.entity'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService
  ) {}

  async findById(id: number): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({ where: { id }, relations: { user: true } })
    if (!employee) throw new NotFoundException(UserError.EMPLOYEE_NOT_FOUND)
    return employee
  }

  // Dùng cho module khác (phiếu nhập, đơn hàng…) để lấy nhân viên đang thao tác
  async findActiveByUserId(userId: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: { user: true }
    })
    if (!employee) throw new ForbiddenException(UserError.NOT_ACTIVE_EMPLOYEE)
    return employee
  }

  async findAll(query: GetEmployeesQueryDto): Promise<PageDto<EmployeeEntity>> {
    const qb = this.employeeRepository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.user', 'user')
      .innerJoinAndSelect('employee.position', 'position')

    if (query.q) {
      qb.andWhere('(user.email ILIKE :q OR user.fullName ILIKE :q OR user.phone ILIKE :q)', { q: `%${query.q}%` })
    }
    if (query.positionId) qb.andWhere('position.id = :positionId', { positionId: query.positionId })
    if (query.isActive !== undefined) qb.andWhere('employee.isActive = :isActive', { isActive: query.isActive })

    const [employees, itemCount] = await qb
      .orderBy('employee.createdAt', query.order ?? 'DESC')
      .skip(query.skip)
      .take(query.take)
      .getManyAndCount()

    return new PageDto(employees, new PageMetaDto({ pageOptionsDto: query, itemCount }))
  }

  // Tạo tài khoản STAFF + hồ sơ nhân viên trong cùng 1 transaction
  async create(data: CreateEmployeeDto): Promise<EmployeeEntity> {
    const { id } = await this.dataSource.transaction(async manager => {
      if (await this.usersService.emailExists(data.email, manager)) {
        throw new ConflictException(AuthError.EMAIL_EXISTS)
      }
      const position = await manager.findOneBy(PositionEntity, { id: data.positionId })
      if (!position) throw new NotFoundException(UserError.POSITION_NOT_FOUND)

      const user = await this.usersService.create(
        {
          email: data.email,
          passwordHash: await hashPassword(data.password),
          fullName: data.fullName,
          phone: data.phone,
          role: Role.STAFF
        },
        manager
      )
      return manager.save(manager.create(EmployeeEntity, { user, position, salary: data.salary, hiredAt: data.hiredAt }))
    })
    return this.findById(id)
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.findById(id)

    await this.dataSource.transaction(async manager => {
      if (data.positionId !== undefined) {
        const position = await manager.findOneBy(PositionEntity, { id: data.positionId })
        if (!position) throw new NotFoundException(UserError.POSITION_NOT_FOUND)
        employee.position = position
      }
      if (data.salary !== undefined) employee.salary = data.salary

      if (data.isActive !== undefined && data.isActive !== employee.isActive) {
        employee.isActive = data.isActive
        // Nghỉ việc → khóa đăng nhập; quay lại làm → mở lại tài khoản
        await manager.update(
          UserEntity,
          { id: employee.user.id },
          data.isActive ? { status: UserStatus.ACTIVE } : { status: UserStatus.INACTIVE, refreshTokenHash: null }
        )
      }

      // Đổi vị trí có hiệu lực với access token mới (sau khi refresh / đăng nhập lại)
      await manager.save(EmployeeEntity, employee)
    })
    return this.findById(id)
  }
}
