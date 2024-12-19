const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customercontrollers.js');


router.post('/add-customers', customerController.createCustomer);
router.get('/get-customers', customerController.getCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;
