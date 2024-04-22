const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res) => {
    try {
        const result = await transactionService.createTransaction(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const result = await transactionService.getTransactionById(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(404).send(error.message);
    }
};
