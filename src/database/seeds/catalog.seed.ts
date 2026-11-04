import { toSlug } from 'src/common/utils/slug.util';
import { BrandEntity } from 'src/modules/products/entities/brand.entity';
import { CategoryEntity } from 'src/modules/products/entities/category.entity';
import { PriceEntity } from 'src/modules/products/entities/price.entity';
import { ProductSkuEntity } from 'src/modules/products/entities/product-sku.entity';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { SpuSkuMappingEntity } from 'src/modules/products/entities/spu-sku-mapping.entity';
import type { Seeder } from './run-seed';

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'ASUS'];
const CATEGORIES = ['Điện thoại', 'Đồng hồ thông minh', 'Laptop'];

type SeedSku = {
  skuCode: string;
  name: string;
  attributes: Record<string, string>;
  sellingPrice: number;
  displayPrice: number;
};
type SeedProduct = {
  name: string;
  brand: string;
  category: string;
  warrantyMonths: number;
  specs: Record<string, string>;
  skus: SeedSku[];
};

const PRODUCTS: SeedProduct[] = [
  {
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'Điện thoại',
    warrantyMonths: 12,
    specs: { 'Màn hình': '6.1 inch OLED', Chip: 'A16 Bionic' },
    skus: [
      {
        skuCode: 'IP15-128-BLK',
        name: 'iPhone 15 128GB Đen',
        attributes: { Màu: 'Đen', 'Dung lượng': '128GB' },
        sellingPrice: 19990000,
        displayPrice: 22990000,
      },
      {
        skuCode: 'IP15-256-BLU',
        name: 'iPhone 15 256GB Xanh',
        attributes: { Màu: 'Xanh', 'Dung lượng': '256GB' },
        sellingPrice: 22990000,
        displayPrice: 25990000,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'Điện thoại',
    warrantyMonths: 12,
    specs: { 'Màn hình': '6.2 inch Dynamic AMOLED 2X', Chip: 'Exynos 2400' },
    skus: [
      {
        skuCode: 'SS-S24-256-GRY',
        name: 'Galaxy S24 256GB Xám',
        attributes: { Màu: 'Xám', 'Dung lượng': '256GB' },
        sellingPrice: 18990000,
        displayPrice: 22990000,
      },
    ],
  },
  {
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'Đồng hồ thông minh',
    warrantyMonths: 12,
    specs: { 'Kích thước mặt': '45mm', 'Chống nước': '50m' },
    skus: [
      {
        skuCode: 'AW9-45-MID',
        name: 'Apple Watch S9 45mm Midnight',
        attributes: { Màu: 'Midnight', 'Kích thước': '45mm' },
        sellingPrice: 10490000,
        displayPrice: 11990000,
      },
    ],
  },
  {
    name: 'ASUS Zenbook 14 OLED',
    brand: 'ASUS',
    category: 'Laptop',
    warrantyMonths: 24,
    specs: { CPU: 'Intel Core Ultra 7 155H', 'Màn hình': '14 inch OLED 3K' },
    skus: [
      {
        skuCode: 'ASUS-ZB14-16-512',
        name: 'Zenbook 14 OLED 16GB/512GB',
        attributes: { RAM: '16GB', SSD: '512GB' },
        sellingPrice: 24990000,
        displayPrice: 27990000,
      },
    ],
  },
];

// Dữ liệu catalog mẫu cho môi trường dev
export const catalogSeeder: Seeder = {
  name: 'catalog (brands, categories, products)',
  run: async (dataSource) => {
    await dataSource.getRepository(BrandEntity).upsert(
      BRANDS.map((name) => ({ name, slug: toSlug(name) })),
      ['slug'],
    );
    await dataSource.getRepository(CategoryEntity).upsert(
      CATEGORIES.map((name) => ({ name, slug: toSlug(name) })),
      ['slug'],
    );

    for (const item of PRODUCTS) {
      const slug = toSlug(item.name);
      if (await dataSource.getRepository(ProductEntity).existsBy({ slug }))
        continue;

      await dataSource.transaction(async (manager) => {
        const product = await manager.save(
          manager.create(ProductEntity, {
            name: item.name,
            slug,
            warrantyMonths: item.warrantyMonths,
            specs: item.specs,
            brand: await manager.findOneByOrFail(BrandEntity, {
              slug: toSlug(item.brand),
            }),
            category: await manager.findOneByOrFail(CategoryEntity, {
              slug: toSlug(item.category),
            }),
          }),
        );
        for (const { sellingPrice, displayPrice, ...skuData } of item.skus) {
          const sku = await manager.save(
            manager.create(ProductSkuEntity, skuData),
          );
          await manager.save(
            manager.create(SpuSkuMappingEntity, {
              spuId: product.id,
              skuId: sku.id,
            }),
          );
          await manager.insert(PriceEntity, {
            productSkuId: sku.id,
            beginAt: new Date(),
            sellingPrice,
            displayPrice,
          });
        }
      });
    }
  },
};
