import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { ValidationPipe } from 'src/shared/validation/validation.pipe';
import { z } from 'zod';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':account_id')
  async findOne(@Param('account_id', new ValidationPipe(z.string().uuid())) id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }
}