import { Body, Controller, Inject, Param, Post, Put, Delete, Get } from "@nestjs/common";
import { IImageService } from "./image.service.interface";
import { ImageDto } from "./image.dto";

@Controller('image') 
export class ImageController {
    
    constructor(@Inject('IImageService')
        private imageService: IImageService
    ) {}

    @Post('create')
    async createImage(@Body() image: ImageDto): Promise<ImageDto> {
        return await this.imageService.createOne(image);
    }


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