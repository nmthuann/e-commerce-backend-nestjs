export class PositionDto {
  id: number
  name: string
  description: string

  constructor(position: Partial<PositionDto>) {
    if (!position) throw new Error('Invalid category data')
    Object.assign(this, position)
  }
}
