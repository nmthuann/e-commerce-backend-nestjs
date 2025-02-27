import { BrandEntity } from './brand.entity'

export class BrandDto {
  id: number
  brandName: string
  brandUrl: string
  description?: string
  brandAbbreviation: string

  constructor(brand: BrandEntity) {
    this.id = brand.id
    this.brandName = brand.brandName
    this.brandUrl = brand.brandUrl
    this.description = brand.description
    this.brandAbbreviation = brand.brandAbbreviation
  }
}
