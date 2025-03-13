import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WarrantyEntity } from '../../domain/entities/warranty.entity'
import { IWarrantyService } from '../warranty.service.interface'
import { WarrantyDetailEntity } from '../../domain/entities/warranty-detail.entity'

@Injectable()
export class WarrantyService implements IWarrantyService {
  constructor(
    @InjectRepository(WarrantyEntity)
    private readonly warrantyRepository: Repository<WarrantyEntity>,
    @InjectRepository(WarrantyDetailEntity)
    private readonly warrantyDetailRepository: Repository<WarrantyDetailEntity>
  ) {}
}
