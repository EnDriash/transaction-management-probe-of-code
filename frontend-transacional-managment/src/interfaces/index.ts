export interface TransactionRequest {
    account_id: string;
    amount: number;
  }
  
  export interface Transaction {
    transaction_id: string;
    account_id: string;
    amount: number;
    created_at: string;
  }
  
  export interface Account {
    account_id: string;
    balance: number;
  }