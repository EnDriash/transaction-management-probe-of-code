// pages/index.tsx
'use client'
import { api } from '@/api/axios';
import TransactionForm from '@/compontents/TransactionForm';
import TransactionList from '@/compontents/TransactionList';
import { AccountContext, AccountContextType, AccountProvider } from '@/contexts/AccountContext';
import { Transaction } from '@/interfaces';
import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const FormContainer = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const ListContainer = styled.div`
  flex: 2;
`;

export const TransactionContainer = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { accountId , setAccountId} = React.useContext(AccountContext) as AccountContextType;

  const handleFormSubmit = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
    setAccountId(newTransaction.account_id);
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        const transactions = response.data.filter((transaction: Transaction) => transaction.account_id === accountId
      ); // if i would implement openApi schema i would create additional query for this
      const balance = transactions.reduce(
          (acc: number, transaction: Transaction) => acc + transaction.amount,
          0
        );

        setTransactions(transactions);
        setCurrentBalance(balance);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [refresh, accountId]);

  return (
      <Container>
        <FormContainer>
        <TransactionForm handleFormSubmit={handleFormSubmit} />
        </FormContainer>
        <ListContainer>
          <TransactionList transactions={transactions} currentBalance={currentBalance} />
        </ListContainer>
      </Container>
  );
};

export default TransactionContainer;
