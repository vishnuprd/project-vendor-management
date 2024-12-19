const express = require('express');
const router = express.Router();
const bankDetailsController = require('../controllers/bankdetails');

// Bank details routes
router.post("/add-bankdetails", bankDetailsController.createBankDetails);
router.get("/get-bankdetails", bankDetailsController.getBankDetails);
router.get("/bankdetails/:id", bankDetailsController.getBankDetailsById);
router.put("/update-bankdetails/:id", bankDetailsController.updateBankDetails);
router.delete("/delete-bankdetails/:id", bankDetailsController.deleteBankDetails);

module.exports = router;
