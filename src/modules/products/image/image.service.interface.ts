import { IBaseService } from '../../bases/base.interface';
import { ImageEntity } from './image.entity';

export interface IImageService extends IBaseService<ImageEntity> {
  insertImages(product_id: number, data: any): Promise<ImageEntity[]>;
}
