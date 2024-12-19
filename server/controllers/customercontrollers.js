const mongoose = require('mongoose');
const VendorRegisterForm = require('../models/vendor.js');
const Product = require('../models/product');
const Customer = require('../models/customer');


exports.createCustomer = async (req, res) => {
  try {
    const { 
      VendorRegisterID, 
      productID, 
      customerID, 
      customerName, 
      email, 
      contactNumber, 
      address, 
      city, 
      state, 
      country 
    } = req.body;

    console.log('Received request:', req.body);

    // Validate required fields
    if (!VendorRegisterID || !productID || !customerID || !customerName || !email) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Check if Vendor exists
    const vendor = await VendorRegisterForm.findOne({ _id: VendorRegisterID });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }

    // Check if the Product exists
    const product = await Product.findOne({ _id: productID });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check if the customer already exists by customerID
    const existingCustomer = await Customer.findOne({ customerID });
    if (existingCustomer) {
      return res.status(400).json({ error: "Customer with this ID already exists." });
    }

    // Create new customer
    const customer = new Customer({
      VendorRegisterID: vendor._id, 
      productID, 
      customerID,
      customerName,
      email,
      contactNumber,
      address,
      city,
      state,
      country,
    });

    // Save the new customer
    await customer.save();

    console.log('Customer created:', customer);
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('VendorRegisterID', 'VendorName Email')  // Populate Vendor details
      .populate('productID', 'productName');  // Populate Product details
    
    if (!customers || customers.length === 0) {
      return res.status(404).json({ error: "No customers found." });
    }

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('VendorRegisterID', 'VendorName Email')
      .populate('productID', 'productName'); // Populate product details
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    delete updatedData._id;  // Remove _id from update

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, { new: true })
      .populate('VendorRegisterID', 'VendorName Email')
      .populate('productID', 'productName');
    
    res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
