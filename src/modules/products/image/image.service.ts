import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/modules/bases/base.abstract';

import { ImageEntity } from './image.entity';
import { Repository } from 'typeorm';
import { IProductService } from '../product/product.service.interface';
import { IImageService } from './image.service.interface';

import { ImageError } from 'src/common/errors/errors';

@Injectable()
export class ImageService
  extends BaseService<ImageEntity>
  implements IImageService
{
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject('IProductService')
    private productService: IProductService,
  ) {
    super(imageRepository);
  }

  async updateImages(product_id: number, data: any): Promise<ImageEntity[]> {
      // Delete existing images for the product_id
      await this.imageRepository.delete({ product: { product_id: product_id } });

      const updatedImages: ImageEntity[] = [];
      const findProduct = await this.productService.getOneById(product_id);

      for (const item of data) {
          const url = item.url;

          // Create a new image
          const newImage = new ImageEntity();
          newImage.product = findProduct;
          newImage.url = url;

          try {
              // Save the new image
              const updatedImage = await this.imageRepository.save(newImage);
              updatedImages.push(updatedImage);
              console.log(updatedImage);
          } catch (error) {
              console.error('Error updating image:', error);
              throw new Error(ImageError.CREATE_IMAGE_ERROR);
          }
      }

      return updatedImages;
  }

  async insertImages(product_id: number, data: any): Promise<ImageEntity[]> {
    const insertedImages: ImageEntity[] = [];
    const findProduct = await this.productService.getOneById(product_id);

    for (const item of data) {
      const url = item.url;

      const newImage = new ImageEntity();
      newImage.product = findProduct;
      newImage.url = url;

      try {
        const insertedImage = await this.imageRepository.save(newImage);
        insertedImages.push(insertedImage);
        console.log(insertedImage);
      } catch (error) {
        console.error('Lỗi trong quá trình lưu hình ảnh:', error);
        throw Error(ImageError.CREATE_IMAGE_ERROR);
      }
    }
    return insertedImages;
  }
}
