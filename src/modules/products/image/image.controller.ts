import { Body, Controller, Inject, Param, Post, Put, Delete, Get } from "@nestjs/common";
import { IImageService } from "./image.service.interface";
import { ImageDto, InsertImageDto } from "./image.dto";
import { ImageEntity } from "./image.entity";
import { InsertImagesDto } from "./create-image.dto";

@Controller('image') 
export class ImageController {
    
    constructor(@Inject('IImageService')
        private imageService: IImageService
    ) {}

    @Post('create')
    async createImage(@Body() image: ImageDto): Promise<ImageEntity> {
        return await this.imageService.createOne(image);
    }

    @Post('insert-images/:product_id')
    async insertImages(@Param('product_id') product_id: string, @Body() data: any){//: Promise<ImageEntity[]> {
        const product = parseInt(product_id,10);
        console.log("get::",data, "product_id", product)
        const result = await this.imageService.insertImages(product, data);
        console.log("result",result)
        return result
    }

    // @Post('create-images')
    // async createImages(@Body() images: InsertImageDto[]): Promise<ImageEntity[]> {
    //     return await this.imageService.InsertImages(images);
    // }


    @Put('update/:id')
    async updateImageById(@Param('id') id: number, @Body() imageDto: ImageDto): Promise<ImageDto> {
        return this.imageService.updateOneById(id, imageDto);
    }


    @Delete('delete/:id')
    async deleteImageById(@Param('id') id: number): Promise<void> {
        console.log(await this.imageService.deleteOneById(id));
    }

    
    @Get('get-images')
    async getImages(): Promise<ImageDto[]> {
        return await this.imageService.getAll();
    }


    @Get(':id')
    async getImage(@Param('id') id: number): Promise<ImageDto> {
        return await this.imageService.getOneById(id);
    }
}