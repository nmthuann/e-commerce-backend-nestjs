import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { ProductError } from 'src/common/enums/errors.enum'
import { UserEntity } from 'src/modules/users/domain/entities/user.entity'
import { toPublicUser } from 'src/modules/users/domain/dto/user.dto'
import { CreatePriceDto, CurrentPriceDto, PriceHistoryItemDto } from '../dto/price.dto'
import { PriceEntity } from '../entities/price.entity'
import { ProductSkuEntity } from '../entities/product-sku.entity'

// Cho phép lệch đồng hồ nhỏ giữa client và server khi gửi beginAt = "bây giờ"
const CLOCK_SKEW_MS = 60_000

type CurrentPriceRow = { product_sku_id: number; selling_price: string; display_price: string; begin_at: Date }

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  /** Giá đang áp dụng của nhiều SKU trong 1 query; SKU chưa có giá không có trong Map */
  async getCurrentPrices(skuIds: number[], manager?: EntityManager): Promise<Map<number, CurrentPriceDto>> {
    if (skuIds.length === 0) return new Map()
    const rows: CurrentPriceRow[] = await (manager ?? this.dataSource).query(
      `SELECT DISTINCT ON (product_sku_id) product_sku_id, selling_price, display_price, begin_at
         FROM prices
        WHERE product_sku_id = ANY($1) AND begin_at <= now()
        ORDER BY product_sku_id, begin_at DESC`,
      [skuIds]
    )
    return new Map(
      rows.map(row => [
        row.product_sku_id,
        { sellingPrice: Number(row.selling_price), displayPrice: Number(row.display_price), beginAt: row.begin_at }
      ])
    )
  }

  async getHistory(skuId: number): Promise<PriceHistoryItemDto[]> {
    await this.assertSkuExists(skuId)
    const prices = await this.priceRepository.find({
      where: { productSkuId: skuId },
      relations: { createdBy: true },
      order: { beginAt: 'DESC' }
    })
    const now = Date.now()
    const current = prices.find(price => price.beginAt.getTime() <= now)
    return prices.map(price => ({
      sellingPrice: price.sellingPrice,
      displayPrice: price.displayPrice,
      beginAt: price.beginAt,
      createdAt: price.createdAt,
      createdBy: toPublicUser(price.createdBy),
      isCurrent: price === current
    }))
  }

  /** Đổi giá = thêm bản ghi mới; giá cũ giữ nguyên làm lịch sử */
  async create(skuId: number, data: CreatePriceDto, actorId: string | null, manager?: EntityManager): Promise<PriceEntity> {
    const repository = manager ? manager.getRepository(PriceEntity) : this.priceRepository
    if (!manager) await this.assertSkuExists(skuId)

    const beginAt = data.beginAt ? new Date(data.beginAt) : new Date()
    // Không cho đặt giá lùi về quá khứ → lịch sử giá đã áp dụng không bị viết lại
    if (beginAt.getTime() < Date.now() - CLOCK_SKEW_MS) throw new BadRequestException(ProductError.PRICE_IN_PAST)

    const displayPrice = data.displayPrice ?? data.sellingPrice
    if (displayPrice < data.sellingPrice) throw new BadRequestException(ProductError.DISPLAY_PRICE_TOO_LOW)

    // Dùng insert() chứ không dùng save(): save() sẽ UPDATE nếu PK (product_sku_id, begin_at) đã tồn tại,
    // còn insert() để Postgres từ chối bản ghi trùng → AllExceptionsFilter trả 409
    await repository.insert({
      productSkuId: skuId,
      beginAt,
      sellingPrice: data.sellingPrice,
      displayPrice,
      createdBy: actorId ? ({ id: actorId } as UserEntity) : null
    })
    return repository.findOneByOrFail({ productSkuId: skuId, beginAt })
  }

  private async assertSkuExists(skuId: number) {
    if (!(await this.dataSource.getRepository(ProductSkuEntity).existsBy({ id: skuId }))) {
      throw new NotFoundException(ProductError.SKU_NOT_FOUND)
    }
  }
}
