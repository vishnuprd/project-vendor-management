const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorregister.js');



router.post("/add-vendor", vendorController.createVendor);
router.get("/get-vendors", vendorController.getVendors);
router.get("/vendor/:id", vendorController.getVendorById);
router.put("/update-vendor/:id", vendorController.updateVendor);
router.delete("/delete-vendor/:id", vendorController.deleteVendor);

module.exports = router;
