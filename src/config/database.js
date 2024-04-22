require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('DB_PASS: ' +  process.env.DB_PASS);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

module.exports = sequelize;