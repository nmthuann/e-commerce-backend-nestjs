import { Expose } from "class-transformer";

export class CreateImageDto {

  // @Expose()
  // image_id: string;
  url: string[];
}


export class InsertImagesDto{
  url: string[];
}
