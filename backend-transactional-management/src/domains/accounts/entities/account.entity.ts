import { Transaction } from '@src/domains/transactions/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


  @Entity()
  export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('int')
    balance: number;

    @OneToMany(() => Transaction, transaction => transaction.account)
    transactions: Transaction[];
  }