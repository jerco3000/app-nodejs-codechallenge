const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Transaction
const Transaction = sequelize.define('Transaction', {
    transactionExternalId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    accountExternalIdDebit: {
        type: DataTypes.UUID,
        allowNull: false
    },
    accountExternalIdCredit: {
        type: DataTypes.UUID,
        allowNull: false
    },
    transferTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    transactionStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'transactions',
    schema: 'public',
    timestamps: true,
});

module.exports = {
    sequelize,
    Transaction
};
