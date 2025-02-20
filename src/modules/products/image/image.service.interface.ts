import { IBaseService } from '../../../common/bases/base.interface';
import { ImageEntity } from './image.entity';

export interface IImageService extends IBaseService<ImageEntity> {
  insertImages(product_id: number, data: any): Promise<ImageEntity[]>;
  updateImages(product_id: number, data: any): Promise<ImageEntity[]>;
}
