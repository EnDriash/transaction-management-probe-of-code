import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDto, createTransactionDtoSchema } from './dto/create-transaction.dto';
import { Account } from '@src/domains/accounts/entities/account.entity';

describe('TransactionsService Units', () => { // Isolation everywhere tests -> scope only to functions
  let service: TransactionsService;
  let accountsService: AccountsService;
  let repo: Repository<Transaction>;
  let accRepo: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Account), useClass: Repository },
        { provide: getRepositoryToken(Transaction), useClass: Repository },
        AccountsService,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    accountsService = module.get<AccountsService>(AccountsService);
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    accRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('simple unit test example based on checkInsufficientFunds method', () => {
    expect(service.checkInsufficientFunds(0)).toBe(false);
    expect(service.checkInsufficientFunds(-1)).toBe(true);
  });

  it('should create a transaction', async () => {
    const dto: CreateTransactionDto = { account_id: 'uuid', amount: 100 };
    const transaction: Transaction = new Transaction();
    transaction.id = 'uuid';
    transaction.account_id = dto.account_id;
    transaction.amount = dto.amount;
    transaction.created_at = new Date();
    transaction.account = new Account();

    const account = { balance: 1000, /* other properties */ };

    jest.spyOn(repo, 'create').mockReturnValue(transaction);
    jest.spyOn(accountsService, 'findOne').mockReturnValue(account as unknown as Promise<Account>);
    jest.spyOn(accountsService, 'update').mockReturnValue(account as unknown as Promise<Account>);
    jest.spyOn(repo, 'save').mockResolvedValue(transaction);

    expect(await service.create(dto)).toEqual(transaction);
  });

  it('should throw an error if account balance is insufficient', async () => {
  const dto: CreateTransactionDto = { account_id: 'uuid', amount: -5 };
  const transaction: Transaction = new Transaction();
  transaction.id = 'uuid';
  transaction.account_id = dto.account_id;
  transaction.amount = dto.amount;
  transaction.created_at = new Date();
  transaction.account = new Account();

  const account = { balance: 0, /* other properties */ };

  jest.spyOn(repo, 'create').mockReturnValue(transaction);
  jest.spyOn(accountsService, 'findOne').mockReturnValue(account as unknown as Promise<Account>);
  await expect(service.create(dto)).rejects.toThrow('Insufficient funds');
});

  it('should find all transactions', async () => {
    const transaction: Transaction = new Transaction();
    transaction.id = 'uuid';
    transaction.account_id = 'uuid';
    transaction.amount = 100;
    transaction.created_at = new Date();
    transaction.account = new Account();

    jest.spyOn(repo, 'find').mockResolvedValue([transaction]);

    expect(await service.findAll()).toEqual([transaction]);
  });

  it('should find all transactions for a user', async () => {
    const transaction: Transaction = new Transaction();
    transaction.id = 'uuid';
    transaction.account_id = 'uuid';
    transaction.amount = 100;
    transaction.created_at = new Date();
    transaction.account = new Account();

    jest.spyOn(repo, 'find').mockResolvedValue([transaction]);

    expect(await service.findAllForUser('userId')).toEqual([transaction]);
  });

  it('should find one transaction', async () => {
    const transaction: Transaction = new Transaction();
    transaction.id = 'uuid';
    transaction.account_id = 'uuid';
    transaction.amount = 100;
    transaction.created_at = new Date();
    transaction.account = new Account();

    jest.spyOn(repo, 'findOne').mockResolvedValue(transaction);

    expect(await service.findOne('transactionId')).toEqual(transaction);
  });
});