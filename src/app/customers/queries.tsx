import { gql } from "@apollo/client";

// Query to fetch all transactions
const GET_TRANSACTIONS = gql`
  query GetTransactions($customerId: Int!) {
    transactions(customerId: $customerId) {
      id
      name
      amount
      currency
      customer {
        name
      }
      date
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
      customer {
        id
      }
      amount
      date
    }
  }
`;

export { CREATE_TRANSACTION, GET_CUSTOMERS, GET_TRANSACTIONS };
