import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { BrandEntity } from '../../../brand/brand.entity'
import { CategoryEntity } from '../../../category/category.entity'
import { ProductEntity } from '../../domain/entities/product.entity'
import { IProductService } from '../product.service.interface'
import { PageDto } from 'src/common/dtos/page.dto'
import { ProductDto } from '../../domain/dtos/product.dto'
import { GetProductsQueryDto } from '../../domain/dtos/requests/get-products-query.dto'
import { SkuDto } from '../../domain/dtos/sku.dto'
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'
import { SpuSkuMappingEntity } from '../../domain/entities/spu-sku-mapping.entity'
import { ProductSkuEntity } from '../../domain/entities/product-sku.entity'
import { PriceEntity } from 'src/modules/products/product/domain/entities/price.entity'
import { ProductResponse, SkuResponse } from '../../domain/dtos/responses/product.response'
import { CreateProductDto } from '../../domain/dtos/requests/create-product.dto'
import { CreatePriceDto } from '../../domain/dtos/requests/create-price.dto'
import { mapSkuAttributes } from 'src/utils/map'

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(ProductSkuEntity)
    private readonly skuRepository: Repository<ProductSkuEntity>,

    @InjectRepository(SpuSkuMappingEntity)
    private readonly supSkuMappingRepository: Repository<SpuSkuMappingEntity>,

    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>
  ) {}

  createPriceBySkuId(skuId: number, data: CreatePriceDto): Promise<SkuDto> {
    throw new Error('Method not implemented.')
  }
  createOne(data: CreateProductDto): Promise<ProductDto> {
    throw new Error('Method not implemented.')
  }

  private async getBrandByBrandUrl(brandUrl: string): Promise<BrandEntity> {
    const brand = await this.brandRepository.findOne({ where: { brandUrl } })
    if (!brand) throw new NotFoundException(`Brand '${brandUrl}' not found`)
    return brand
  }

  private async getCategoryByCategoryUrl(categoryUrl: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { categoryUrl } })
    if (!category) throw new NotFoundException(`Category '${categoryUrl}' not found`)
    return category
  }

  async getProductsWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductResponse>> {
    const { categoryUrl, brandUrl, search, order, page, take } = query

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .select([
        'product.id',
        'product.productName',
        'product.slug',
        'category.categoryName',
        'category.categoryUrl',
        'brand.brandName',
        'brand.brandUrl'
      ])
      .where('product.status = :status', { status: true })

    if (categoryUrl) {
      queryBuilder.andWhere('category.categoryUrl = :categoryUrl', { categoryUrl })
    }

    if (brandUrl) {
      queryBuilder.andWhere('brand.brandUrl = :brandUrl', { brandUrl })
    }

    if (search) {
      queryBuilder.andWhere('product.productName ILIKE :search', { search: `%${search}%` })
    }

    queryBuilder.orderBy('product.prioritySort', order || 'ASC').addOrderBy('product.createdAt', order || 'DESC')

    const [rawProducts, itemCount] = await queryBuilder
      .offset((page - 1) * take)
      .limit(take)
      .getManyAndCount()

    if (rawProducts.length === 0) {
      return new PageDto([], new PageMetaDto({ pageOptionsDto: query, itemCount: 0 }))
    }

    const spuIds = rawProducts.map(p => p.id)
    const skusWithPrices: SpuSkuMappingType[] = await this.supSkuMappingRepository
      .createQueryBuilder('spuSkuMapping')
      .leftJoinAndSelect('spuSkuMapping.sku', 'sku')
      .leftJoin(
        qb =>
          qb
            .subQuery()
            .select(['p1.product_sku_id', 'p1.selling_price', 'p1.display_price', 'p1.begin_at'])
            .from('prices', 'p1')
            .where('p1.begin_at = (SELECT MAX(p2.begin_at) FROM prices p2 WHERE p2.product_sku_id = p1.product_sku_id)')
            .orderBy('p1.begin_at', 'DESC'),
        'latest_price',
        'latest_price.product_sku_id = sku.id'
      )
      .where('spuSkuMapping.spu IN (:...spuIds)', { spuIds })
      .andWhere('spuSkuMapping.status = true') // ✅ Chỉ lấy mapping đang hoạt động
      .select([
        'spuSkuMapping.spu AS spu',
        'sku.id AS sku',
        'sku.skuName AS skuName',
        'sku.image AS image',
        'sku.slug AS slug',
        'sku.skuAttributes AS skuAttributes',
        'latest_price.selling_price AS sellingPrice',
        'latest_price.display_price AS displayPrice'
      ])
      .getRawMany()
    const productSkuMap = skusWithPrices.reduce((acc, sku) => {
      if (!acc[sku.spu]) acc[sku.spu] = []
      acc[sku.spu].push({
        id: sku.sku,
        skuName: sku.skuname,
        image: sku.image,
        slug: sku.slug,
        skuAttributes: mapSkuAttributes(sku.skuattributes),
        sellingPrice: sku.sellingprice || 0,
        displayPrice: sku.displayprice || 0
      })
      return acc as SkuResponse[]
    }, {})

    const res: ProductResponse[] = rawProducts.map(product => ({
      id: product.id,
      productName: product.productName,
      slug: product.slug,
      categoryName: product.category?.categoryName || null,
      categoryUrl: product.category?.categoryUrl || null,
      brandName: product.brand?.brandName || null,
      brandUrl: product.brand?.brandUrl || null,
      skus: productSkuMap[product.id] || []
    }))

    const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount })
    return new PageDto(res, pageMeta)
  }

  getOneById(id: number): Promise<ProductDto> {
    throw new Error('Method not implemented.')
  }
  getProductsBySku(skuId: number): Promise<SkuDto[]> {
    throw new Error('Method not implemented.')
  }
}
