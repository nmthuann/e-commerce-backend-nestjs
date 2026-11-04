import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductError } from 'src/common/enums/errors.enum'
import { toSlug } from 'src/common/utils/slug.util'
import { CreateBrandDto, UpdateBrandDto } from '../dto/brand.dto'
import { BrandEntity } from '../entities/brand.entity'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>
  ) {}

  findAll(): Promise<BrandEntity[]> {
    return this.brandRepository.find({ order: { name: 'ASC' } })
  }

  async findOne(where: { id: number } | { slug: string }): Promise<BrandEntity> {
    const brand = await this.brandRepository.findOneBy(where)
    if (!brand) throw new NotFoundException(ProductError.BRAND_NOT_FOUND)
    return brand
  }

  // Trùng name / slug → AllExceptionsFilter trả 409
  create(data: CreateBrandDto): Promise<BrandEntity> {
    return this.brandRepository.save(this.brandRepository.create({ ...data, slug: data.slug ?? toSlug(data.name) }))
  }

  async update(id: number, data: UpdateBrandDto): Promise<BrandEntity> {
    await this.findOne({ id })
    await this.brandRepository.update({ id }, data)
    return this.findOne({ id })
  }

  // Thương hiệu còn sản phẩm → FK RESTRICT → AllExceptionsFilter trả 400
  async remove(id: number): Promise<void> {
    await this.findOne({ id })
    await this.brandRepository.delete({ id })
  }
}
