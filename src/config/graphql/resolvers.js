const { Transaction } = require('../../models/transactionModel');

const resolvers = {
    Query: {
        transactions: async () => {
            return await Transaction.findAll();
        }
    }
};

module.exports = resolvers;
