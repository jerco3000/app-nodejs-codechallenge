const { Transaction } = require('../../src/models/transactionModel');

describe('Transaction Model', () => {
    it('deberia crear una transaccion con data valida', async () => {
        const transactionData = {
            accountExternalIdDebit: "123e4567-e89b-12d3-a456-426614174007",
            accountExternalIdCredit: "123e4567-e89b-12d3-a456-426614174008",
            transferTypeId: 101,
            value: 777
        };
        const transaction = await Transaction.create(transactionData);
        expect(transaction).toHaveProperty('transactionExternalId');
    });
});

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
});