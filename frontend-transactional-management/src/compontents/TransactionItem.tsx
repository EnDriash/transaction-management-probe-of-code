import { Transaction } from "@/interfaces"
import { ReactNode } from "react";
import styled from 'styled-components';

const TransactionItem = styled.div`
  border: 1px solid #ced4da;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #ffffff;
`;

const TransactionTitle = styled.p`
  font-size: 1.2rem;
  color: #212529;
  margin-bottom: 10px;
`;


interface TransactionTileProps {
    transaction: Transaction;
    children?: React.ReactNode;
    balance?: number;
    indexOrder?: number;
}

const TransactionTile = ({transaction, children, balance, indexOrder}: TransactionTileProps) => {
    const transactionTitleText =   `Transferred ${Math.abs(transaction.amount)}$ ${transaction.amount < 0 ? 'from' : 'to'} account ${transaction.account_id}`
    return (
        <TransactionItem
        key={transaction.transaction_id}
        data-type="transaction"
        data-account-id={transaction.account_id}
        data-amount={transaction.amount}
        data-balance={indexOrder === 0 ? balance : undefined}
        >
        <TransactionTitle>
          {transactionTitleText}
        </TransactionTitle>
        {children}

      </TransactionItem>
    )
};

export default TransactionTile;