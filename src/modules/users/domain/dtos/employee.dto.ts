import { PositionDto } from './position.dto'

export class EmployeeDto {
  id: number
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  gender?: string
  phone?: string
  birthday?: Date
  salary: number
  workStatus: boolean
  address: string
  workStartDate: Date
  position: PositionDto
}
