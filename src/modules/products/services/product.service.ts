import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PageMetaDto } from 'src/common/dto/page-meta.dto'
import { PageDto } from 'src/common/dto/page.dto'
import { ProductError } from 'src/common/enums/errors.enum'
import { SerialStatus } from 'src/common/enums/serial-status.enum'
import { toSlug } from 'src/common/utils/slug.util'
import {
  AdminGetProductsQueryDto,
  CreateProductDto,
  ProductDetailDto,
  ProductSort,
  ProductSummaryDto,
  UpdateProductDto
} from '../dto/product.dto'
import { BrandEntity } from '../entities/brand.entity'
import { CategoryEntity } from '../entities/category.entity'
import { ProductEntity } from '../entities/product.entity'
import { ProductSkuService } from './product-sku.service'

type ListOptions = { includeInactive: boolean }

const SORT_SQL: Record<ProductSort, string> = {
  [ProductSort.FEATURED]: 'p.sort_order ASC, p.created_at DESC',
  [ProductSort.NEWEST]: 'p.created_at DESC',
  [ProductSort.PRICE_ASC]: 's.min_price ASC NULLS LAST',
  [ProductSort.PRICE_DESC]: 's.min_price DESC NULLS LAST',
  [ProductSort.NAME]: 'p.name ASC'
}

type ProductSummaryRow = {
  id: number
  name: string
  slug: string
  is_active: boolean
  brand_id: number
  brand_name: string
  brand_slug: string
  category_id: number
  category_name: string
  category_slug: string
  thumbnail_url: string | null
  min_price: string | null
  max_price: string | null
  display_price: string | null
  stock: number
  sku_count: number
}

const toNumber = (value: string | null) => (value === null ? null : Number(value))

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly skuService: ProductSkuService
  ) {}

  /**
   * Danh sách sản phẩm kèm giá hiện hành (min/max) và tồn kho, gom trong 1 query (+1 query đếm).
   * Public chỉ thấy sản phẩm / SKU đang bán; admin thấy tất cả.
   */
  async findAll(query: AdminGetProductsQueryDto, { includeInactive }: ListOptions): Promise<PageDto<ProductSummaryDto>> {
    if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
      throw new BadRequestException(ProductError.PRICE_RANGE_INVALID)
    }

    const params: unknown[] = [SerialStatus.AVAILABLE]
    const param = (value: unknown) => `$${params.push(value)}`
    const where: string[] = []

    if (!includeInactive) where.push('p.is_active = true')
    else if (query.isActive !== undefined) where.push(`p.is_active = ${param(query.isActive)}`)
    if (query.q) where.push(`p.name ILIKE ${param(`%${query.q}%`)}`)
    if (query.brand) where.push(`b.slug = ${param(query.brand)}`)
    if (query.category) where.push(`c.slug = ${param(query.category)}`)
    if (query.minPrice !== undefined) where.push(`s.min_price >= ${param(query.minPrice)}`)
    if (query.maxPrice !== undefined) where.push(`s.min_price <= ${param(query.maxPrice)}`)
    if (query.inStock) where.push('s.stock > 0')

    // s: tổng hợp theo SPU từ các SKU (giá hiện hành = bản ghi begin_at <= now() mới nhất)
    const from = `
      FROM products p
      JOIN brands b ON b.id = p.brand_id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN LATERAL (
        SELECT MIN(cp.selling_price) AS min_price,
               MAX(cp.selling_price) AS max_price,
               (ARRAY_AGG(cp.display_price ORDER BY cp.selling_price ASC NULLS LAST))[1] AS display_price,
               COALESCE(SUM(st.stock), 0)::int AS stock,
               COUNT(sku.id)::int AS sku_count,
               (ARRAY_AGG(sku.image_url ORDER BY sku.id) FILTER (WHERE sku.image_url IS NOT NULL))[1] AS thumbnail_url
          FROM spu_sku_mapping m
          JOIN product_skus sku ON sku.id = m.sku_id ${includeInactive ? '' : 'AND sku.is_active = true'}
          LEFT JOIN LATERAL (
            SELECT pr.selling_price, pr.display_price FROM prices pr
             WHERE pr.product_sku_id = sku.id AND pr.begin_at <= now()
             ORDER BY pr.begin_at DESC LIMIT 1
          ) cp ON true
          LEFT JOIN LATERAL (
            SELECT COUNT(*) AS stock FROM product_serials ps
             WHERE ps.product_sku_id = sku.id AND ps.status = $1
          ) st ON true
         WHERE m.spu_id = p.id
      ) s ON true
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`

    const [{ count }] = await this.dataSource.query(`SELECT COUNT(*)::int AS count ${from}`, params)
    const rows: ProductSummaryRow[] = await this.dataSource.query(
      `SELECT p.id, p.name, p.slug, p.is_active,
              b.id AS brand_id, b.name AS brand_name, b.slug AS brand_slug,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
              s.thumbnail_url, s.min_price, s.max_price, s.display_price, s.stock, s.sku_count
       ${from}
       ORDER BY ${SORT_SQL[query.sort ?? ProductSort.FEATURED]}, p.id DESC
       LIMIT ${param(query.take)} OFFSET ${param(query.skip)}`,
      params
    )

    const items: ProductSummaryDto[] = rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      brand: { id: row.brand_id, name: row.brand_name, slug: row.brand_slug },
      category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
      thumbnailUrl: row.thumbnail_url,
      minPrice: toNumber(row.min_price),
      maxPrice: toNumber(row.max_price),
      displayPrice: toNumber(row.display_price),
      stock: row.stock ?? 0,
      skuCount: row.sku_count ?? 0,
      isActive: row.is_active
    }))
    return new PageDto(items, new PageMetaDto({ pageOptionsDto: query, itemCount: count }))
  }

  /** Chi tiết SPU + SKU (giá hiện hành, tồn kho). Public: 404 nếu sản phẩm ngừng bán, ẩn SKU ngừng bán */
  async findDetail(where: { id: number } | { slug: string }, { includeInactive }: ListOptions): Promise<ProductDetailDto> {
    const product = await this.productRepository.findOne({
      where,
      relations: { brand: true, category: true, spuSkuMappings: { sku: true } }
    })
    if (!product || (!includeInactive && !product.isActive)) {
      throw new NotFoundException(ProductError.PRODUCT_NOT_FOUND)
    }

    const skus = (product.spuSkuMappings ?? [])
      .map(mapping => mapping.sku)
      .filter(sku => includeInactive || sku.isActive)
      .sort((a, b) => a.id - b.id)

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      specs: product.specs,
      warrantyMonths: product.warrantyMonths,
      isActive: product.isActive,
      sortOrder: product.sortOrder,
      brand: { id: product.brand.id, name: product.brand.name, slug: product.brand.slug },
      category: { id: product.category.id, name: product.category.name, slug: product.category.slug },
      skus: await this.skuService.toDetails(skus)
    }
  }

  /** Tạo SPU + toàn bộ SKU (+ giá ban đầu) trong 1 transaction */
  async create(data: CreateProductDto, actorId: string): Promise<ProductDetailDto> {
    const { skus, brandId, categoryId, ...productData } = data
    const id = await this.dataSource.transaction(async manager => {
      const [brand, category] = await Promise.all([
        manager.findOneBy(BrandEntity, { id: brandId }),
        manager.findOneBy(CategoryEntity, { id: categoryId })
      ])
      if (!brand) throw new NotFoundException(ProductError.BRAND_NOT_FOUND)
      if (!category) throw new NotFoundException(ProductError.CATEGORY_NOT_FOUND)

      // Trùng name / slug → AllExceptionsFilter trả 409
      const product = await manager.save(
        manager.create(ProductEntity, { ...productData, slug: productData.slug ?? toSlug(productData.name), brand, category })
      )
      for (const sku of skus) {
        await this.skuService.create(product.id, sku, actorId, manager)
      }
      return product.id
    })
    return this.findDetail({ id }, { includeInactive: true })
  }

  async update(id: number, data: UpdateProductDto): Promise<ProductDetailDto> {
    const product = await this.productRepository.findOneBy({ id })
    if (!product) throw new NotFoundException(ProductError.PRODUCT_NOT_FOUND)

    const { brandId, categoryId, ...productData } = data
    Object.assign(product, productData)
    if (brandId !== undefined) {
      product.brand = await this.dataSource.getRepository(BrandEntity).findOneBy({ id: brandId })
      if (!product.brand) throw new NotFoundException(ProductError.BRAND_NOT_FOUND)
    }
    if (categoryId !== undefined) {
      product.category = await this.dataSource.getRepository(CategoryEntity).findOneBy({ id: categoryId })
      if (!product.category) throw new NotFoundException(ProductError.CATEGORY_NOT_FOUND)
    }
    await this.productRepository.save(product)
    return this.findDetail({ id }, { includeInactive: true })
  }
}
