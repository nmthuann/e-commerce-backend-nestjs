import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ISupplierService } from './supplier.service.interface'
import { SupplierEntity } from './supplier.entity'
import { SupplierDto } from './supplier.dto'

@Injectable()
export class SupplierService implements ISupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>
  ) {}

  async getAll(): Promise<SupplierDto[]> {
    const suppliers = await this.supplierRepository.find()
    return suppliers.map(supplier => new SupplierDto(supplier))
  }
}
