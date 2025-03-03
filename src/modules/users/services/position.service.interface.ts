import { PositionDto } from '../domain/dtos/position.dto'

export interface IPositionService {
  getAll(): Promise<PositionDto[]>
}
