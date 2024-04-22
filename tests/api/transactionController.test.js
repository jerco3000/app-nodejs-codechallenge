const request = require('supertest');
const app = require('../../src/app');

describe('Transaction API', () => {
    describe('POST /api/transactions', () => {
        it('deberia crear transaccion', async () => {
            const transactionData = {
                accountExternalIdDebit: "123e4567-e89b-12d3-a456-426614174001",
                accountExternalIdCredit: "123e4567-e89b-12d3-a456-426614174002",
                transferTypeId: 101,
                value: 777
            };
            const response = await request(app).post('/api/transactions').send(transactionData);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('transactionExternalId');
        });
    });
});

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    console.log.mockRestore();
});