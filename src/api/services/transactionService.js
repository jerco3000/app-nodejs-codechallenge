const { Transaction } = require('../../models/transactionModel');
const producer = require('../../kafka/kafkaProducer');
const redisClient = require('../../config/redisClient');
const { shouldRejectTransaction } = require('../../utils/preFraudChecks');

exports.createTransaction = async (transactionData) => {
    //
    //Validar reglas de preFraudeChecks
    //
    if (shouldRejectTransaction(transactionData)) {
        transactionData.transactionStatus = 'rejected';
        const transaction = await Transaction.create(transactionData);
        return {error: 'Transaccion excede valor preFraudCheck'};
    } else {
        //
        // Comprobar si la transacción ya existe en Redis
        //
        const redisKey = `transaction:${transactionData.accountExternalIdDebit}`;
        const existingTransaction = await redisClient.get(redisKey);

        if (existingTransaction) {
            console.log("Transaccion ya existe en Redis, update a db...");
            const transaction = JSON.parse(existingTransaction);
            await updateTransactionInDatabase(transaction);
            return transaction;
        } else {
            // Crear la transacción en la bd
            const transaction = await Transaction.create(transactionData);

            // Añadir el transactionExternalId
            transactionData.transactionExternalId = transaction.transactionExternalId;

            // Enviar el mensaje a Kafka
            const kafkaMessage = JSON.stringify(transactionData);
            producer.send([{
                topic: 'transaction_created',
                messages: [kafkaMessage]
            }], function (err, data) {
                if (err) {
                    console.error("Error enviando mensaje a Kafka:", err);
                } else {
                    console.log("Mensaje enviado a Kafka:", data);
                }
            });

            // Nueva transacción en Redis
            await redisClient.set(redisKey, JSON.stringify(transactionData));

            return transaction;
        }
    }
};


async function updateTransactionInDatabase(transaction) {
    try {
            // Actualizar la transacción si el estado es 'pending'
            const updated = await Transaction.update(
                { transactionStatus: transaction.transactionStatus },
                { where: { transactionExternalId: transaction.transactionExternalId } }
            );
            console.log('DB update ok:', updated);

    } catch (error) {
        console.error('DB update error:', error);
    }
}

exports.getTransactionById = async (transactionId) => {
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};
