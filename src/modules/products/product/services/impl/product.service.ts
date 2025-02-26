import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BrandEntity } from "../../../brand/brand.entity";
import { CategoryEntity } from "../../../category/category.entity";
import { ProductEntity } from "../../domain/entities/product.entity";
import { IProductService } from "../product.service.interface";
import { PageDto } from "src/common/dtos/page.dto";
import { CreateProductDto } from "src/modules/v1/products/product/product-dto/create-product.dto";
import { ProductDto } from "../../domain/dtos/product.dto";
import { GetProductsQueryDto } from "../../domain/dtos/requests/get-products-query.dto";
import { SkuDto } from "../../domain/dtos/sku.dto";
import { PageMetaDto } from "src/common/dtos/page-meta.dto";
import { SpuSkuMappingEntity } from "../../domain/entities/spu-sku-mapping.entity";
import { ProductSkuEntity } from "../../domain/entities/product-sku.entity";
import { PriceEntity } from "src/modules/products/pricing/price.entity";
import { ProductResponse } from "../../domain/dtos/responses/product.response";

@Injectable()
export class ProductService implements IProductService{
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
    ) {

    }
    createOne(data: CreateProductDto): Promise<ProductDto> {
        throw new Error("Method not implemented.");
    }

    private async getBrandByBrandUrl(brandUrl: string): Promise<BrandEntity>{
        const brand = await this.brandRepository.findOne({ where: { brandUrl } });
        if (!brand) throw new NotFoundException(`Brand '${brandUrl}' not found`);
        return brand;
    }

    private async getCategoryByCategoryUrl(categoryUrl: string): Promise<CategoryEntity>{
        const category = await this.categoryRepository.findOne({ where: { categoryUrl } });
        if (!category) throw new NotFoundException(`Category '${categoryUrl}' not found`);
        return category;
    }

    async getProductsWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductDto>> {
        const { categoryUrl, brandUrl, search, order, page, take } = query;

        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            // .leftJoin('spu_sku_mapping', 'mapping', 'mapping.spu_id = product.id')
            // .leftJoinAndSelect('mapping.sku', 'sku')
            // .leftJoin('prices', 'price', 'price.product_sku_id = sku.id') // Sửa lại quan hệ
            // .select([
            //     'product.id',
            //     'product.productName',
            //     'product.slug',
            //     'category.categoryName',
            //     'category.categoryUrl',
            //     'brand.brandName',
            //     'brand.brandUrl',
            //     'sku.id',
            //     'sku.skuName',
            //     'sku.image',
            //     'sku.slug',
            //     'price.sellingPrice',
            // ]);

        if (categoryUrl) {
            queryBuilder.andWhere('category.categoryUrl = :categoryUrl', { categoryUrl });
        }

        if (brandUrl) {
            queryBuilder.andWhere('brand.brandUrl = :brandUrl', { brandUrl });
        }

        if (search) {
            queryBuilder.andWhere('product.productName ILIKE :search', { search: `%${search}%` });
        }

        queryBuilder.orderBy('product.prioritySort', order || 'ASC')
                    .addOrderBy('product.createdAt', order || 'DESC');
                    
        const rawProducts = await queryBuilder
                    .offset((page - 1) * take)
                    .limit(take)
                    .getMany();

        const itemCount = await queryBuilder.getCount();
            // **🚀 Lấy danh sách SKU cho từng sản phẩm**
            const productsWithSkus = await Promise.all(
                rawProducts.map(async (product) => {
                    const spuSkuMappings = await this.supSkuMappingRepository.find({
                       where: { spu: { id: product.id } },
                        relations: ['sku'],
                    });

                    // Lấy danh sách SKU từ quan hệ `spuSkuMappings`
                    const skus = spuSkuMappings.map((mapping) => ({
                        id: mapping.sku.id,
                        skuName: mapping.sku.skuName,
                        image: mapping.sku.image,
                        slug: mapping.sku.slug,
                        //sellingPrice: mapping.sku.sellingPrice,
                    }));

                    return { ...product, skus };
                    //console.log({ ...product, skus })
                })
            );

        console.log(productsWithSkus.map(sku => sku.skus))


        const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount: productsWithSkus.length });

        // truy vấn vào SpuSkuEntity findBySpuId -> đc list SkuId sau đó lấy tất cả các Sku tương ứng theo Sku id đã có

        return new PageDto(rawProducts, pageMeta);
    }

    getOneById(id: number): Promise<ProductDto> {
        throw new Error("Method not implemented.");
    }
    getProductsBySku(skuId: number): Promise<SkuDto[]> {
        throw new Error("Method not implemented.");
    }
}

