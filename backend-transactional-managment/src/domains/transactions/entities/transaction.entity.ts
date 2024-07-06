  import { Account } from '@src/domains/accounts/entities/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

  @Entity()
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('uuid')
    account_id: string;
    
    @ManyToOne(() => Account, account => account.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
    account: Account;
  
    @Column('int')
    amount: number;
  
    @CreateDateColumn()
    created_at: Date; 
  }