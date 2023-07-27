import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/modules/bases/base.abstract";
import { ImageDto } from "./image.dto";
import { IImageService } from "./image.service.interface";
import { ImageEntity } from "./image.entity";
import { Repository } from "typeorm";

@Injectable()
export class ImageService extends BaseService<ImageDto> implements IImageService {
  constructor(
    @InjectRepository(ImageEntity) 
    private imageRepository: Repository<ImageDto>) {
        super(imageRepository);
    }
}