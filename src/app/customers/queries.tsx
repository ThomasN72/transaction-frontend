import { gql } from "@apollo/client";

// Query to fetch all transactions
const GET_TRANSACTIONS = gql`
  query GetTransaction {
    transactions {
      id
      name
      amount
      currency
    }
  }
`;
const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      id
      name
      customer
      amount
      date
    }
  }
`;

// Mutation to create a new transaction
const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionDto!) {
    createTransaction(input: $input) {
      name
      customerId
      amount
      date
    }
  }
`;

export { CREATE_TRANSACTION, GET_CUSTOMERS, GET_TRANSACTIONS };
