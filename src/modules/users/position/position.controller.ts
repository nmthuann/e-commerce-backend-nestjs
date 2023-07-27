import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { PositionDto } from '../position/position.dto';
import { IPositionService } from './position.service.interface';

// working with DTO
@Controller('position') 
export class PositionController {
    
    constructor(@Inject('IPositionService')
        private positionService: IPositionService
    ) {}

    @Post('create')
    async createPosition(@Body() position: PositionDto): Promise<PositionDto> {
        return await this.positionService.createOne(position);
    }


    @Put('update/:id')
    async updatePositionById(@Param('id') id: number, @Body() positionDto: PositionDto): Promise<PositionDto> {
        return this.positionService.updateOneById(id, positionDto);
    }


    @Delete('delete/:id')
    async deletePositionById(@Param('id') id: number): Promise<void> {
        console.log(await this.positionService.deleteOneById(id));
    }

    
    @Get('get-positions')
    async getPositions(): Promise<PositionDto[]> {
        return await this.positionService.getAll();
    }


    @Get(':id')
    async getPosition(@Param('id') id: number): Promise<PositionDto> {
        return await this.positionService.getOneById(id);
    }
}