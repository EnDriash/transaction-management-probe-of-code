// pages/api/transactions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from '../../src/interfaces';

// Mock data - replace with database logic
let transactions: Transaction[] = [
  {
    transaction_id: '1',
    account_id: 'account_1',
    amount: 100,
    created_at: new Date().toISOString(),
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    const { account_id, amount } = req.body;
    const newTransaction = {
      transaction_id: Date.now().toString(),
      account_id,
      amount,
      created_at: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
