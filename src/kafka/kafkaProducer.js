const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST || 'localhost:9092' });
const producer = new kafka.Producer(client);
const admin = new kafka.Admin(client); // Crear una instancia de Admin para manejar tópicos.

function createTopicsIfNeeded(topics) {
    admin.listTopics((err, res) => {
        if (err) {
            console.error("Error listing topics:", err);
            return;
        }

        // Obtener la lista de tópicos existentes desde el objeto de respuesta.
        const existingTopics = Object.keys(res[1].metadata);
        console.log("Existing topics:", existingTopics);

        // Filtrar y crear solo los tópicos que no existen.
        const topicsToCreate = topics.filter(topic => !existingTopics.includes(topic));

        if (topicsToCreate.length > 0) {
            console.log("Creating new topics:", topicsToCreate);
            // Preparar los tópicos para creación
            const topicsConfig = topicsToCreate.map(topic => ({
                topic: topic,
                partitions: 1,
                replicationFactor: 1
            }));

            // Crear tópicos que no existen.
            admin.createTopics(topicsConfig, (err, result) => {
                if (err) {
                    console.error("Error creating topics:", err);
                } else {
                    console.log("Topics created successfully:", result);
                }
            });
        } else {
            console.log("All topics already exist or no new topics to create.");
        }
    });
}

producer.on('ready', function () {
    console.log('Kafka Producer is connected and ready.');
    // Verificar y crear tópicos si es necesario.
    createTopicsIfNeeded(['transaction_created', 'transaction_received']);
});

producer.on('error', function (error) {
    console.error('Producer error:', error);
});

module.exports = producer;
