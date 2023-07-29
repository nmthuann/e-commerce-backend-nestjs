import { Body, Controller, Get, Inject, Param, Post, Put, Delete } from "@nestjs/common";
import { IAccountService } from "./account.service.interface";
import { AccountDto } from "./account-dto/account.dto";

@Controller('account') 
export class AccountController {
    
    constructor(@Inject('IAccountService')
        private accountService: IAccountService
    ) {}

    @Post('create')
    async createAccount(@Body() account: AccountDto): Promise<AccountDto> {
        return await this.accountService.createOne(account);
    }


    @Put('update/:id')
    async updateAccountById(@Param('id') id: number, @Body() accountDto: AccountDto): Promise<AccountDto> {
        return this.accountService.updateOneById(id, accountDto);
    }


    @Delete('delete/:id')
    async deleteAccountById(@Param('id') id: number): Promise<void> {
        console.log(await this.accountService.deleteOneById(id));
    }

    
    @Get('get-Accounts')
    async getAccounts(): Promise<AccountDto[]> {
        return await this.accountService.getAll();
    }


    @Get(':id')
    async getAccount(@Param('id') id: number): Promise<AccountDto> {
        return await this.accountService.getOneById(id);
    }
}