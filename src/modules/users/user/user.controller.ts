import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { UserDto } from '../user/user-dto/user.dto';
import { IUserService } from './user.service.interface';

// working with DTO
@Controller('user') 
export class UserController {
    
    constructor(@Inject('IUserService')
        private userService: IUserService
    ) {}

    @Post('create')
    async createUser(@Body() user: UserDto): Promise<UserDto> {
        console.log(user)
        return await this.userService.createOne(user);
    }


    @Put('update/:id')
    async updateUserById(@Param('id') id: number, @Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.updateOneById(id, userDto);
    }


    @Delete('delete/:id')
    async deleteUserById(@Param('id') id: number): Promise<void> {
        console.log(await this.userService.deleteOneById(id));
    }

    
    @Get('get-users')
    async getUsers(): Promise<UserDto[]> {
        return await this.userService.getAll();
    }


    @Get(':id')
    async getUser(@Param('id') id: number): Promise<UserDto> {
        return await this.userService.getOneById(id);
    }
}