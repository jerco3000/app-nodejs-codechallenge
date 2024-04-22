const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Transaction {
    transactionExternalId: ID!
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transferTypeId: Int!
    value: Float!
    transactionStatus: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    transactions: [Transaction]
  }
`;

module.exports = typeDefs;
