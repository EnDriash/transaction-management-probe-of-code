import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    
    const account = await this.accountsService.findOne(transaction.account_id);
    account.balance += transaction.amount;

    if(this.checkInsufficientFunds(account.balance)) {
      throw new Error('Insufficient funds');
    }
      
    await this.transactionRepository.save(transaction);
    await this.accountsService.update(account);

    return transaction
  }

  checkInsufficientFunds(balance: number): boolean { // for unit test purpose only, it should show what i consider as unit test / check comments in tests files
    return balance < 0
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({order: {created_at: 'DESC'}});
  }

  async findAllForUser(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({where: {account_id: userId}});
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({where: {id: id}}) as Promise<Transaction>;
  }
}