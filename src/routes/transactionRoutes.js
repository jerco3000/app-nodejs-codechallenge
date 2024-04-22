const express = require('express');
const router = express.Router();
const transactionController = require('../api/controllers/transactionController');

// Define las rutas para las transacciones
router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);

module.exports = router;
