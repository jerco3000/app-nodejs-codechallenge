// src/services/transactionStatusUpdater.js
const kafka = require('kafka-node');
const { Transaction } = require('../../models/transactionModel');
const redisClient = require('../../redis/redisClient');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const Consumer = kafka.Consumer;

const consumer = new Consumer(
    client,
    [{ topic: 'transaction_received', partition: 0 }],
    {
        autoCommit: true
    }
);

consumer.on('message', async function (message) {
    console.log('Received message from Kafka:', message.value);
    const data = JSON.parse(message.value);
    await updateTransactionInDatabase(data);
    await storeInRedis(data);
});

consumer.on('error', function (err) {
    console.error('Kafka Consumer error:', err);
});

async function updateTransactionInDatabase(data) {
    try {
        const updated = await Transaction.update(
            { transactionStatus: data.transactionStatus.name },
            { where: { transactionExternalId: data.transactionExternalId } }
        );
        console.log('DB updated:', updated);
    } catch (error) {
        console.error('DB update error:', error);
    }
}


async function storeInRedis(data) {
    try {
        const jsonData = JSON.stringify(data);
        const key = `transaction:${data.transactionExternalId}`;
        await redisClient.set(key, jsonData);
        await redisClient.expire(key, 18000); // Establece la expiración a 18000 segundos (5 horas)
        console.log('Data almacenada expira en 5 horas');
    } catch (error) {
        console.error('Redis error:', error);
    }
}



module.exports = consumer;
