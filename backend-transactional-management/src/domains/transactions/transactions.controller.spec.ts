import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { randomUUID } from 'crypto';

const dto1 = {  amount: 100, account_id: randomUUID()};
const dto2 = {  amount: 200, account_id: randomUUID()};
const trans1 ={ id: 'a uuid', ...dto1 } as Transaction
const trans2 = { id: 'a uuid', ...dto2 } as Transaction

describe('TransactionsController (integration)', () => {  // Isolation tests isolation on edge  -> scope to dependencies without integration with external services
  let mockRepository: Partial<Record<keyof Repository<Transaction>, jest.Mock>>;
  let mockAccountRepository: Partial<Record<keyof Repository<Account>, jest.Mock>>;
  let app: INestApplication;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto: any) => ({ id: 'a uuid', ...dto })),
      find: jest.fn().mockResolvedValue([trans1, trans2]),
      findOne: jest.fn().mockResolvedValue(trans1),
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockAccountRepository = {
      create: jest.fn().mockImplementation((dto: any) => ({ id: 'a uuid', ...dto })),
      find: jest.fn().mockResolvedValue([{id: 'a uuid', balance: 10}]),
      findOne: jest.fn().mockResolvedValue({id: 'a uuid', balance: 10}),
      save: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        AccountsService,
        { provide: getRepositoryToken(Account), useValue: mockAccountRepository },
        { provide: getRepositoryToken(Transaction), useValue: mockRepository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/transactions (POST)', () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send(dto1)
      .expect(201)
      .expect({ id: 'a uuid', ...dto1 });
  });

  it('/transactions (GET)', () => {
    //create a transaction
     request(app.getHttpServer())
      .post('/transactions')
      .send(dto1)
      .expect(201)
      .expect({ id: 'a uuid', ...dto1 });

    //create another transaction
     request(app.getHttpServer())
      .post('/transactions')
      .send(dto2)
      .expect(201)
      .expect({ id: 'a uuid', ...dto2 });

    //get all transactions
    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect([trans1, trans2]);
  });

  it('/transactions/:transaction_id (GET)', () => {
    const id = randomUUID();
    return request(app.getHttpServer())
      .get(`/transactions/${id}`)
      .expect(200)
      .expect({...trans1});
  });

  afterEach(async () => {
    await app.close();
  });
});