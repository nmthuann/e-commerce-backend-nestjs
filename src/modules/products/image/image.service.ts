import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/modules/bases/base.abstract";


import { ImageEntity } from "./image.entity";
import { Repository } from "typeorm";
import { IProductService } from "../product/product.service.interface";
import { IImageService } from "./image.service.interface";
import { InsertImagesDto } from "./create-image.dto";
import { ImageDto } from "./image.dto";
import { ImageError } from "src/common/errors/errors";

@Injectable()
export class ImageService extends BaseService<ImageEntity> implements IImageService {
  constructor(
    @InjectRepository(ImageEntity) 
    private imageRepository: Repository<ImageEntity>,
    @Inject('IProductService')
    private productService: IProductService) {
        super(imageRepository);
    }

    async insertImages(product_id: number, data: any): Promise<ImageEntity[]> {
  //     const insertedImages: ImageEntity[] = [];
  //     const findProduct = await this.productService.getOneById(product_id);
  //     for (const url of data.url) {
  //       const newImage = new ImageEntity();
  //       newImage.product = findProduct;
  //       newImage.url = url; 
  //       const insertedImage = await this.imageRepository.save(newImage);
  //       insertedImages.push(insertedImage);
  //       console.log(insertedImage)
  //     }

  //     return insertedImages;
  // }
   const insertedImages: ImageEntity[] = [];
  const findProduct = await this.productService.getOneById(product_id);

  // // if (Array.isArray(data.url)) {
  //   // Kiểm tra xem data.url là một mảng
  //   const imagePromises = data.url.map(async (url: string) => {
  // try {
  //   const newImage = new ImageEntity();
  //   newImage.product = findProduct;
  //   newImage.url = url;
  //   const insertedImage = await this.imageRepository.save(newImage);
  //   insertedImages.push(insertedImage);
  //   console.log(insertedImage);
  // } catch (error) {
  //   console.error('Lỗi trong quá trình lưu hình ảnh:', error);
  // }
// });

//     await Promise.all(imagePromises); // Đợi cho tất cả các promises hoàn thành
//   // }

//   return insertedImages;
// }
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
        throw Error(ImageError.CREATE_IMAGE_ERROR)
      }
    }
return insertedImages;

    }
}