import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IProductService } from './product.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Between, Repository, getConnection } from 'typeorm';
import { ICategoryService } from '../category/category.service.interface';
import { IDiscountService } from '../discount/discount.service.interface';
import { CreateProductDto } from './product-dto/create-product.dto';
import { ProductFilterDto } from './product-dto/product-filter.dto';
import { GetProductForOrderDto } from './product-dto/get-product-order.dto';
import { ProductError } from 'src/common/errors/errors';
import { ProductDuplicateDto } from './product-dto/product-duplicate.dto';
import { FilterProductDto } from './product-dto/filter-product.dto';
import { ImageEntity } from '../image/image.entity';

@Injectable()
export class ProductService
  extends BaseService<ProductEntity>
  implements IProductService
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject('ICategoryService')
    private categoryService: ICategoryService,
    @Inject('IDiscountService')
    private discountService: IDiscountService,
  ) {
    super(productRepository);
  }

  async getModelName() {
    //const productList = await this.productRepository.createQueryBuilder('products')
    // // .select(['product_id', 'model_name',  'image.url'])
    // // .leftJoin('products.images', 'image') // Thực hiện left join với bảng Image
    // // .getRawOne()
      //   .select(['product_id', 'model_name', 'image.url'])
      //   .innerJoin('products.images', 'image')
      //  // .groupBy('product_id, image.url')
      //   .getRawMany();return productList;




   const subQuery = this.productRepository
    .createQueryBuilder('subQuery')
    .select('image.url', 'url')
    .leftJoin(ImageEntity, 'image', 'image.product = subQuery.product_id')
    .limit(1)
    .where('subQuery.product_id = product.product_id');
    const query = this.productRepository
    .createQueryBuilder('product')
    .select(['product_id', 'model_name'])
    .addSelect(`(${subQuery.getQuery()})`, 'image')
    .getRawMany();

  return await query;

  }


  async filterProductsByRam(products: ProductEntity[], ram: number): Promise<ProductEntity[]> {
    // Thực hiện lọc sản phẩm dựa trên RAM
    return products.filter(product => product.ram === ram);
  }

  async filterProductsByMemory(products: ProductEntity[], memory: number): Promise<ProductEntity[]> {
    // Thực hiện lọc sản phẩm dựa trên bộ nhớ
    return products.filter(product => product.memory === memory);
  }

  async filterProductsByCategory(products: ProductEntity[], category: number): Promise<ProductEntity[]> {
    const productIds = products.map(product => product.product_id);
    const productList = await this.productRepository.createQueryBuilder('product')
      .where('product.category.category_id = :category', { category })
      .andWhere('product.product_id IN (:...productIds)', { productIds })
      .getMany();
    return productList;
  }

  async filterProductsByPrice(products: ProductEntity[], minPrice:number, maxPrice: number): Promise<ProductEntity[]> {
      const filteredProducts = products.filter(product => {
      if (minPrice !== undefined && product.price < minPrice) {
        return false; // Không thỏa mãn điều kiện dưới mức giá tối thiểu
      }

      if (maxPrice !== undefined && product.price > maxPrice) {
        return false; // Không thỏa mãn điều kiện trên mức giá tối đa
      }

      return true; // Thỏa mãn cả hai điều kiện hoặc không có điều kiện nào
    });

    // console.log(filteredProducts)
    return filteredProducts;
  }


  /**
   * 
   * @param ram 
   * @returns [ids] | null
   */
  async createFilterProductsByRam(ram: number): Promise<number[] | null> {
    const productList = await this.productRepository.find({
      select: ["product_id"], // Chỉ chọn cột id
      where: {
        ram: ram
      }
    });

    if (productList.length === 0) {
      return null;
    }

    return productList.map(product => product.product_id);
  }

  async createFilterProductsByMemory(memory: number): Promise<number[] | null> {
    const productList = await this.productRepository.find({
      select: ["product_id"], // Chỉ chọn cột id
      where: {
        memory: memory
      }
    });

    if (productList.length === 0) {
      return null;
    }

    return productList.map(product => product.product_id);
  }

  async createFilterProductsByCategory(category_id: number): Promise<number[] | null> {
  // Tìm sản phẩm dựa vào khóa ngoại category_id
    const productList = await this.productRepository.find({
      relations: {
        category: true // Sử dụng tên của trường thể hiện tương ứng trong entity của bạn
      },
      where: {
        category:{
          category_id: category_id
        }
      },
      select: ['product_id'], // Chọn các trường bạn muốn trả về (product_id)
    });

    if (productList && productList.length > 0) {
      // Chuyển danh sách sản phẩm thành mảng các product_id
      const productIds = productList.map(product => product.product_id);
      return productIds;
    } else {
      return null;
    }
  }
  
  async createFilterProductsByPrice(minPrice: number, maxPrice: number) {
    const queryBuilder = this.productRepository.createQueryBuilder('products');

    queryBuilder.select('products.product_id', 'id'); // Chỉ lấy cột id

    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('products.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    } else if (minPrice !== undefined) {
      queryBuilder.andWhere('products.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      queryBuilder.andWhere('products.price <= :maxPrice', { maxPrice });
    }

    const result = await queryBuilder.getRawMany();
    return result.map(item => item.id);
        // const query = this.productRepository.createQueryBuilder('products');

    //   if (minPrice !== undefined && maxPrice !== undefined) {
    //     query.where('products.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    //   } else if (minPrice !== undefined) {
    //     query.where('products.price >= :minPrice', { minPrice });
    //   } else if (maxPrice !== undefined) {
    //     query.where('products.price <= :maxPrice', { maxPrice });
    //   }

    //   const result = await query.getMany();
    //   return result;
  }


  // //products: Product[], filterFunc: (product: Product) => boolean
  async * createFilterProducts(filter: FilterProductDto) { //: Generator<Promise<unknown> | null>
    if (filter.ram) {
      const filterRam = await this.createFilterProductsByRam(filter.ram);
      const result =  filterRam;
      yield result;
    } else {
      yield null;
    }
  }


  async filterProducts(filter: FilterProductDto): Promise<ProductEntity[]> {
    // Sử dụng các bộ lọc theo điều kiện từ FilterProductDto
    let products = await this.getAll();
    /**
     * 1. lấy cái to bớt dần
     * 2. mỗi lần push vào
     */
    if (filter.ram) {
      products = await this.filterProductsByRam(products, filter.ram);
    }
    if (filter.memory) {
      products = await this.filterProductsByMemory(products, filter.memory);
    }
    if (filter.category) {
      products = await this.filterProductsByCategory(products, filter.category);
    }
    if (filter.maxPrice || filter.minPrice) {
      products = await this.filterProductsByPrice(products,filter.minPrice, filter.maxPrice);
    }
    return products;
  }
  

  async checkProductDuplicate(product: ProductDuplicateDto): Promise<ProductEntity>{
    const productDuplicate = await this.productRepository.findOne({
      where:{
        model_name: product.model_name,
        hardware: product.hardware,
        color: product.color,
        screen: product.screen,
        battery: product.battery,
        memory: product.memory,
        front_camera: product.front_camera,
        behind_camera: product.behind_camera,
        ram: product.ram
      }
    })
    return productDuplicate;
  }

  async checkInventoryOrderOnline(product_ids: number[]): Promise<boolean> {
    let check = true; // Biến cờ, mặc định tất cả sản phẩm đều còn hàng tồn

    for (const product_id of product_ids) {
      const product = await this.productRepository.findOneById(product_id);
      if (product) {
        const quantity = product.quantity;
        if (quantity <= 0) {
          check = false;
        }
      } else {
        check = false;
      }
    }
    return check;
  }

  async createOne(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const newProduct = new ProductEntity();
      newProduct.model_name = data.model_name;
      newProduct.price = data.price;
      newProduct.unit_price = data.unit_price;
      newProduct.quantity = data.quantity;
      newProduct.status = true;
      newProduct.description = data.description;
      newProduct.operation_system = data.operation_system;
      newProduct.hardware = data.hardware;
      newProduct.warranty_time = data.warranty_time;
      (newProduct.screen = data.screen), (newProduct.vote = 0);
      newProduct.color = data.color;
      newProduct.battery = data.battery;
      newProduct.memory = data.memory;
      newProduct.front_camera = data.front_camera;
      newProduct.behind_camera = data.behind_camera;
      newProduct.ram = data.ram;
      newProduct.category = await this.categoryService.getOneById(
        data.category_id as unknown as number,
      );
      newProduct.discount = await this.discountService.getOneById(
        data.discount_id as unknown as number,
      );
      const createProduct = await this.productRepository.save(newProduct);

      return createProduct;
    } catch (error) {
      // throw new Error(`An unexpected error occurred while creating the Product ${error}`);
      console.log(`${error}`);
      throw new Error(ProductError.CREATE_PRODUCT_ERROR);
    }
  }

  async getOneById(id: string | number): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: {
        product_id: id as number,
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProduct;
  }

  async getAll(): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.find({
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProducts;
  }

  async getSomeFields(): Promise<Partial<ProductEntity>[]> {
    const findProducts = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.product_id',
        'product.product_name',
        'product.vote',
        'product.price',
        'product.discount',
      ])
      .leftJoinAndSelect('product.discount', 'discount')
      .getMany();

    return findProducts;
  }

  async getProductsByOptions(data: any): Promise<Partial<ProductEntity>[]> {
    const findProducts = await this.productRepository.find({});
    return;
  }

  async getProductsByCategoryId(category_id: number): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProducts;
  }

  async getProductsByPriceRange(
    category_id: number,
    maxPrice: number,
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
        price: Between(0, maxPrice),
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
  }

  async getProductsByBrand(
    category_id: number,
    brand: string,
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
        operation_system: brand,
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
  }

  async getProductsByFilter(
    category_id: number,
    filterDto: ProductFilterDto,
  ): Promise<ProductEntity[]> {
    const { price, brand } = filterDto;
    console.log(filterDto);
    const query = this.productRepository.createQueryBuilder('product');

    if (category_id) {
      query.andWhere('product.categoryCategoryId = :category_id', {
        category_id: category_id,
      });
    }

    if (price) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: price });
    }

    if (brand) {
      query.andWhere('product.brand LIKE :brand', { brand: `%${brand}%` });
    }
    return query.getMany();
  }

  async getProductBrandByCategoryId(category_id: number): Promise<string[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.select('DISTINCT product.brand');
    query.where('product.categoryCategoryId = :category_id', { category_id });
    const result = await query.getRawMany();
    return result.map((item) => item.brand);
  }

  async getProductsByIds(
    data: GetProductForOrderDto[],
  ): Promise<ProductEntity[]> {
    const productIds: number[] = data.map((product) => product.product_id);
    console.log('productsIds:::: ', productIds);

    // const products: ProductEntity[] = [];

    /// Use 'map' instead of 'forEach'
    const getProduct = productIds.map(async (product_id) => {
      try {
        // Fetch the product by its ID and return it
        const product = await this.productRepository.findOne({
          where: {
            product_id: product_id,
          },
          relations: {
            // category: true,
            discount: true,
          },
        });

        return product;
      } catch (error) {
        console.error(
          `Error fetching product with ID ${product_id}:`,
          error.message,
        );
      }
    });

    // Use 'Promise.all' to wait for all the async operations to complete
    const products = await Promise.all(getProduct);

    // Filter out any potential 'undefined' values (e.g., if findOne() throws an error)filter((product) => !!product) as ProductEntity[];
    return products;
  }

  async getProductsByProductIds(ids: number[]): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.findByIds(ids);
    return findProducts;
  }

  async getNewestProducts(topProduct: number): Promise<ProductEntity[]> {
    const newestProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .where('product.status = :status', { status: true })
      .orderBy('product.created_at', 'DESC')
      .limit(topProduct)
      .getMany();

    return newestProducts;
  }
}
