const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/retirar', transactionController.retirarForm);
router.post('/retirar', transactionController.retirar);
router.get('/boleta', transactionController.boleta);

module.exports = router;
