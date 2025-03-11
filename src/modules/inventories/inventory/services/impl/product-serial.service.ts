import { InjectRepository } from '@nestjs/typeorm'
import { IProductSerialService } from '../product-serial.service.interface'
import { ProductSerialEntity } from '../../domain/entities/product-serial.entity'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { PageDto } from 'src/common/dtos/page.dto'
import { GetProductSerialsQueryDto } from '../../domain/dtos/get-product-serials-query.dto'
import { ProductSerialResponse } from '../../domain/dtos/product-serial.response'
import { InventoryDto } from '../../domain/dtos/inventory.dto'
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'
import { mapAttributes } from 'src/utils/map'

@Injectable()
export class ProductSerialService implements IProductSerialService {
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

  async getAllWithPagination(query: GetProductSerialsQueryDto): Promise<PageDto<ProductSerialResponse>> {
    const { warehouseReceiptId, productSkuId, order, page, take } = query
    const queryBuilder = this.productSerialRepository
      .createQueryBuilder('productSerial')
      .leftJoinAndSelect('productSerial.warehouseReceipt', 'warehouseReceipt')
      .leftJoinAndSelect('productSerial.productSku', 'productSku')
      .select([
        'productSerial.id',
        'productSerial.serialNumber',
        'productSerial.dateManufactured',
        'warehouseReceipt.id',
        'warehouseReceipt.receiptNumber',
        'warehouseReceipt.receiptDate',
        'warehouseReceipt.createdAt',
        'productSku.id',
        'productSku.skuNo',
        'productSku.barcode',
        'productSku.skuName',
        'productSku.image',
        'productSku.status',
        'productSku.skuAttributes',
        'productSku.slug'
      ])
      .where('productSku.status = :status', { status: true })

    if (warehouseReceiptId) {
      queryBuilder.andWhere('warehouseReceipt.id = :warehouseReceiptId', { warehouseReceiptId })
    }
    if (productSkuId) {
      queryBuilder.andWhere('productSku.id = :productSkuId', { productSkuId })
    }
    queryBuilder.orderBy('warehouseReceipt.createdAt', order || 'ASC')

    const [rawSerials, itemCount] = await queryBuilder
      .offset((page - 1) * take)
      .limit(take)
      .getManyAndCount()
    if (rawSerials.length === 0) {
      return new PageDto([], new PageMetaDto({ pageOptionsDto: query, itemCount: 0 }))
    }

    const res: ProductSerialResponse[] = rawSerials.map(serial => ({
      id: serial.id,
      serialNumber: serial.serialNumber,
      dateManufactured: serial.dateManufactured,
      warehouseReceipt: {
        id: serial.warehouseReceipt.id,
        receiptNumber: serial.warehouseReceipt.receiptNumber,
        receiptDate: serial.warehouseReceipt.receiptDate,
        createdAt: serial.warehouseReceipt.createdAt
      },
      sku: {
        id: serial.productSku.id,
        skuNo: serial.productSku.skuNo,
        barcode: serial.productSku.barcode,
        skuName: serial.productSku.skuName,
        image: serial.productSku.image,
        status: serial.productSku.status,
        skuAttributes: mapAttributes(serial.productSku.skuAttributes),
        slug: serial.productSku.slug
      }
    }))

    const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount })
    return new PageDto(res, pageMeta)
  }
}
