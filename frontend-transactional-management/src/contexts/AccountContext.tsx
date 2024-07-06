import React from 'react';

export interface AccountContextType {
  accountId: string;
  setAccountId: (accountId: string) => void;
}

export const AccountContext = React.createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accountId, setAccountId] = React.useState('');

    return (
        <AccountContext.Provider value={{ accountId, setAccountId }}>
            {children}
        </AccountContext.Provider>
    );
};
