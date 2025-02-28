import { Injectable } from '@nestjs/common'
import { IInventoryService } from '../inventory.service.interface'
import { ProductSerialEntity } from '../../domain/entities/product-serial.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InventoryDto } from '../../domain/dtos/inventory.dto'

@Injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @InjectRepository(ProductSerialEntity)
    private readonly productSerialRepository: Repository<ProductSerialEntity>
  ) {}

  async getStock(productSkuId: number): Promise<number> {
    const createBuilder: Promise<InventoryDto> = this.productSerialRepository
      .createQueryBuilder('productSerial')
      .leftJoin('order_details', 'od', 'productSerial.id = od.product_serial_id')
      .where('od.product_serial_id IS NULL')
      .andWhere('productSerial.product_sku_id = :productSkuId', { productSkuId })
      .select('COUNT(*)', 'stock')
      .getRawOne()
    // console.log('createBuilder:::', await createBuilder)
    return (await createBuilder).stock
  }
}
