import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findOne(id: string): Promise<Account> {
    return this.accountRepository.findOne({where: {id: id}}) as Promise<Account>;
  }

  async update(account: Account): Promise<Account> {
    return this.accountRepository.save(account);
  }
  
}