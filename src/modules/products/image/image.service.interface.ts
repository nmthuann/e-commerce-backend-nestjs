import { IBaseService } from "../../bases/base.interface";
import { CreateImageDto, InsertImagesDto } from "./create-image.dto";
import { ImageDto, InsertImageDto } from "./image.dto";
import { ImageEntity } from "./image.entity";


export interface IImageService extends IBaseService<ImageEntity>{
    insertImages(product_id: number, data: any): Promise<ImageEntity[]>;
}