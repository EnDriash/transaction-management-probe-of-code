import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, createTransactionDtoSchema } from './dto/create-transaction.dto';
import { ValidationPipe } from '@src/shared/validation/validation.pipe';
import { Transaction } from './entities/transaction.entity';
import { z } from 'zod';
import { Logger } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body(new ValidationPipe(createTransactionDtoSchema)) createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try{
      this.logger.debug('Creating transaction');
      return this.transactionsService.create(createTransactionDto);

    } catch (error) {
     if(error instanceof Error) {
        if(error.message === 'Insufficient funds') {
          this.logger.error('Insufficient funds');
          throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
        }
      }
      this.logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get()
  async findAll(): Promise<Transaction[]> { // --->For future add paging functionality
    this.logger.debug('Finding all transactions');
    return this.transactionsService.findAll();
  }

  @Get(':transaction_id')
  async findOne(@Param('transaction_id', new ValidationPipe(z.string().uuid())) id: string): Promise<Transaction> {
    this.logger.debug('Finding one transaction');
    return this.transactionsService.findOne(id);
  }
}