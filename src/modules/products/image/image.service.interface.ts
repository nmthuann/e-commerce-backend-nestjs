import { IBaseService } from "../../bases/base.interface";
import { ImageDto, InsertImageDto } from "./image.dto";
import { ImageEntity } from "./image.entity";


export interface IImageService extends IBaseService<ImageEntity>{
    // InsertImages(images: InsertImageDto[]): Promise<ImageEntity[]>;
}