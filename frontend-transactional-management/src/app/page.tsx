// pages/index.tsx
'use client'
import TransactionContainer from '@/compontents/TransactionContainer';
import { AccountProvider } from '@/contexts/AccountContext';
import React from 'react';


const Home = () => {
  return (
    <AccountProvider>
      <TransactionContainer />
    </AccountProvider>
  );
};

export default Home;
