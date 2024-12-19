const express = require('express');
const router = express.Router();
const productController = require("../controllers/productcontrollers.js");


router.post('/add-products', productController.createProduct);
router.get('/get-products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
