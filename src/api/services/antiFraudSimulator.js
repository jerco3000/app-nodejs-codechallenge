// Simulador api "ANTIFRAUD"
const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
const Consumer = kafka.Consumer;
const Producer = kafka.Producer;
const producer = new Producer(client);

const consumer = new Consumer(
    client,
    [{ topic: 'transaction_created', partition: 0 }],
    {
        autoCommit: true
    }
);

consumer.on('message', function (message) {
    console.log('Received message:', message.value);
    simulateAntiFraudCheck(JSON.parse(message.value));
});

consumer.on('error', function (err) {
    console.log('Error:', err);
});

producer.on('ready', function() {
    console.log('Producer is ready for sending messages.');
});

producer.on('error', function (err) {
    console.error('Producer error:', err);
});

function simulateAntiFraudCheck(transaction) {
    //Genera respuesta aletaroria
    const statuses = ['approved', 'rejected'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const randomStatus = statuses[randomIndex];

    const antiFraudResponse = {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
            name: transaction.transferTypeId
        },
        transactionStatus: {
            name: randomStatus
        },
        value: transaction.value,
        createdAt: new Date().toISOString()
    };

    console.log('Anti-Fraud Response:', JSON.stringify(antiFraudResponse));
    sendResponseToKafka(antiFraudResponse);
}

function sendResponseToKafka(response) {
    producer.send([{
        topic: 'transaction_received',
        messages: JSON.stringify(response)
    }], function(err, data) {
        if (err) {
            console.error("Error sending response to Kafka:", err);
        } else {
            console.log("Response sent to Kafka successfully:", data);
        }
    });
}

module.exports = { consumer, producer };
