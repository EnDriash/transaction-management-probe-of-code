// src/components/TransactionList.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Transaction } from '../interfaces';
import TransactionTile from './TransactionItem';
import { api } from '@/api/axios';

const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  color: black;
  border-radius: 5px;
  margin: 0 auto;
`;

const TransactionBalance = styled.p`
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 20px;
`;

interface TransactionListProps {
    transactions: Transaction[];
    currentBalance: number;
  }
  
const TransactionList: React.FC<TransactionListProps> = (props: TransactionListProps) => {
    const { transactions, currentBalance } = props;

    return (
        <Container>
            <h2>Transaction history</h2>
     
            {transactions.map((transaction, index) => (
                <TransactionTile 
                    transaction={transaction}     
                    balance={currentBalance}
                    key={transaction.transaction_id}
                    indexOrder={index}
                >
                    
                    {index === 0 && <TransactionBalance>
                            The current account balance is {currentBalance}
                            </TransactionBalance>}
                </TransactionTile>
            ))}
        </Container>
    );
};

export default TransactionList;
