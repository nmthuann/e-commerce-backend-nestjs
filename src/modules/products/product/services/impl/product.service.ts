import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from '../../domain/entities/product.entity'
import { IProductService } from '../product.service.interface'
import { PageDto } from 'src/common/dtos/page.dto'
import { ProductDto } from '../../domain/dtos/product.dto'
import { GetProductsQueryDto } from '../../domain/dtos/requests/get-products-query.dto'
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'
import { SpuSkuMappingEntity } from '../../domain/entities/spu-sku-mapping.entity'
import { ProductResponse, SkuResponse } from '../../domain/dtos/responses/product.response'
import { CreateProductDto } from '../../domain/dtos/requests/create-product.dto'
import { ProductSkuDto } from '../../domain/dtos/product-sku.dto'
import { SpuSkuMappingDto } from '../../domain/dtos/spu-sku-mapping.dto'
import { mapAttributes } from 'src/utils/map'
import { SpuSkuMappingType, SpuSkusType } from '../../domain/types/spu-sku-mapping.type'
import { IProductSerialService } from 'src/modules/inventories/inventory/services/product-serial.service.interface'

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(SpuSkuMappingEntity)
    private readonly supSkuMappingRepository: Repository<SpuSkuMappingEntity>,

    @Inject('IProductSerialService')
    private readonly productSerialService: IProductSerialService
  ) {}

  createOne(data: CreateProductDto): Promise<ProductDto> {
    throw new Error('Method not implemented.')
  }

  async getAllWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductResponse>> {
    const { categoryUrl, brandUrl, search, order, page, take } = query

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .select([
        'product.id',
        'product.productName',
        'product.productLine',
        'product.status',
        'product.description',
        'product.productSpecs',
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
        skuAttributes: mapAttributes(sku.skuattributes),
        sellingPrice: sku.sellingprice || 0,
        displayPrice: sku.displayprice || 0
      })
      return acc as SkuResponse[]
    }, {})

    const res: ProductResponse[] = rawProducts.map(product => ({
      id: product.id,
      productName: product.productName,
      productLine: product.productLine,
      status: product.status,
      description: product.description,
      productSpecs: mapAttributes(product.productSpecs),
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

  async getOneById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['brand'] })
    if (!product) {
      throw new NotFoundException(`Product with slug "${id}" not found`)
    }
    return {
      id: product.id,
      productName: product.productName,
      slug: product.slug,
      productLine: product.productLine,
      description: product.description,
      status: product.status,
      productSpecs: mapAttributes(product.productSpecs),
      brandName: product.brand.brandName
    }
  }

  async getProductBySlug(slug: string): Promise<SpuSkuMappingDto> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .select([
        'product.id',
        'product.productName',
        'product.slug',
        'product.productLine',
        'product.description',
        'product.status',
        'product.productSpecs',
        'brand.brandName',
        'brand.brandUrl'
      ])
      .where('product.slug = :slug', { slug })
    const product = await queryBuilder.getOne()
    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`)
    }

    const spuSkus: SpuSkusType[] = await this.supSkuMappingRepository
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
      .select([
        'sku.id AS id',
        'sku.skuNo AS skuNo',
        'sku.barcode AS barcode',
        'sku.skuName AS skuName',
        'sku.image AS image',
        'sku.status AS status',
        'sku.slug AS slug',
        'sku.skuAttributes AS skuAttributes',
        'latest_price.selling_price AS sellingPrice',
        'latest_price.display_price AS displayPrice'
      ])
      .where('spuSkuMapping.spu = :spu', { spu: product.id })
      .getRawMany()

    // console.log('spuSkus:::', spuSkus)

    const skuMapping: ProductSkuDto[] = await Promise.all(
      spuSkus.map(async spuSku => ({
        id: spuSku.id,
        skuNo: spuSku.skuno,
        barcode: spuSku.barcode,
        skuName: spuSku.skuname,
        image: spuSku.image,
        status: spuSku.status,
        skuAttributes: mapAttributes(spuSku.skuattributes),
        slug: spuSku.slug,
        sellingPrice: spuSku.sellingprice,
        displayPrice: spuSku.displayprice,
        stock: (await this.productSerialService.getStock(spuSku.id)) || 0
      }))
    )

    return {
      id: product.id,
      productName: product.productName,
      slug: product.slug,
      productLine: product.productLine,
      description: product.description,
      status: product.status,
      productSpecs: mapAttributes(product.productSpecs),
      brandName: product.brand.brandName,
      sku: skuMapping
    }
  }
}
