import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { UserDto } from '../user/user-dto/user.dto';
import { IUserService } from './user.service.interface';
import { UserEntity } from './user.entity';

// working with DTO
@Controller('user') 
export class UserController {
    
    constructor(@Inject('IUserService')
        private userService: IUserService
    ) {}

    @Post('create')
    async createUser(@Body() user: UserDto): Promise<UserEntity> {
        console.log(user)
        return await this.userService.createOne(user);
    }


    @Put('update/:id')
    async updateUserById(@Param('id') id: number, @Body() userDto: UserDto): Promise<UserEntity> {
        return this.userService.updateOneById(id, userDto);
    }


    @Delete('delete/:id')
    async deleteUserById(@Param('id') id: number): Promise<void> {
        console.log(await this.userService.deleteOneById(id));
    }

    
    @Get('get-users')
    async getUsers(): Promise<UserEntity[]> {
        return await this.userService.getAll();
    }


    // @Get('get-users-employee')
    // async getUsersIsEmployee(): Promise<UserEntity[]> {
    //     return await this.userService.getUsersIsEmployee();
    // }


    // @Get(':email')
    // async getUserByEmail(@Param('email') email: string): Promise<UserEntity> {
    //     return await this.userService.getUserByEmail(email);
    // }


    @Get(':id')
    async getUser(@Param('id') id: number): Promise<UserDto> {
        return await this.userService.getOneById(id);
    }
}