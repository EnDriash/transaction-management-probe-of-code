import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
// src/components/TransactionForm.tsx

import styled from 'styled-components';
import { api } from '@/api/axios';
import { Transaction } from '@/interfaces';
import { AccountContext } from '@/contexts/AccountContext';
import React from 'react';

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  color: #212529;
`;

const Input = styled(Field)`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: #495057;
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const ErrorMessageStyled = styled(ErrorMessage)`
  color: red;
  font-size: 0.8rem;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const TransactionSchema = Yup.object().shape({
  accountId: Yup.string()
    .required('Account ID is required'),
  amount: Yup.number()
    .notOneOf([0], 'Amount cannot be 0')
    .required('Amount is required'),
});

interface TransactionFormProps {
    handleFormSubmit: (newTransaction: Transaction) => void;
  }
  
const TransactionForm: React.FC<TransactionFormProps> = ({handleFormSubmit}) => {

    const { setAccountId } = React.useContext(AccountContext) || {};

  return (
    <Formik
        initialValues={{ accountId: '', amount: "" }}
        validationSchema={TransactionSchema}
        onSubmit={async (values: { accountId: string; amount: number | string; }, { resetForm, setSubmitting, setStatus }: FormikHelpers<any>) => {
            try {
                const response = await api.post('/transactions', { account_id: values.accountId, amount: values.amount });
                const transaction = response.data; // Extract the transaction data from the response
                setStatus({ success: 'Transaction was successful!' });
                setAccountId && setAccountId(values.accountId);
                handleFormSubmit(transaction);
                resetForm({ values: { accountId: '', amount: "" } });
            } catch (error) {
                 setStatus({ error: 'Transaction failed. Please try again.' });
            }
            setSubmitting(false);
        }}
    >
    {({ isSubmitting }: { isSubmitting: boolean }) => (
        <FormContainer>
          <Label>
            Account ID:
            <Input data-type="account-id"  type="text" name="accountId" />
            <ErrorMessageStyled name="accountId" component="div" />
          </Label>
          <Label>
            Amount:
            <Input data-type="amount" type="number" name="amount" />
            <ErrorMessageStyled name="amount" component="div" />
          </Label>
          <SubmitButton data-type="transaction-submit" type="submit" disabled={isSubmitting}>
            Submit
          </SubmitButton>
        </FormContainer>
      )}
    </Formik>
  );
};

export default TransactionForm;
