import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/modules/bases/base.abstract";
import { ImageDto, InsertImageDto } from "./image.dto";
import { IImageService } from "./image.service.interface";
import { ImageEntity } from "./image.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImageService extends BaseService<ImageEntity> implements IImageService {
  constructor(
    @InjectRepository(ImageEntity) 
    private imageRepository: Repository<ImageEntity>) {
        super(imageRepository);
    }

  //   async InsertImages(images: InsertImageDto[]): Promise<ImageEntity[]> {
  //     const product_id
  //   return await this.imageRepository.save(iamges);
  // }
}