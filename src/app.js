const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const transactionStatusUpdater = require('./api/services/transactionStatusUpdater');
const antiFraudSimulator = require('./api/services/antiFraudSimulator');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./config/graphql/schema');
const resolvers = require('./config/graphql/resolvers');

require('dotenv').config();

//servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

const { sequelize } = require('./models/transactionModel');

sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // Sincroniza todos los modelos
      sequelize.sync({ alter: true }); // solo fines de la prueba
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

// Rutas
app.use('/api/transactions', transactionRoutes);

async function startServer() {
    await server.start();
    // especificar la ruta para GraphQL
    server.applyMiddleware({app, path: '/graphql'});

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();

module.exports = app;

