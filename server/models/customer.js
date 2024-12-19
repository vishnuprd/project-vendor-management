const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    VendorRegisterID: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorRegisterForm' },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  
    customerID: { type: String, required: true, unique: true },  
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String }
}, { timestamps: true }); 

customerSchema.index({ productID: 1 });  

module.exports = mongoose.model('Customer', customerSchema);
