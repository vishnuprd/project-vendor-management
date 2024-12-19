const Product = require('../models/product');
const VendorRegisterForm = require('../models/vendor.js');

exports.createProduct = async (req, res) => {
  try {
    const {
      VendorRegisterID,
      productID,
      productName,
      productCategory,
      productPrice,
      oneTimeCost,
      amcValue,
      dateOfPurchase,
      dateOfRenewal,
      otherCharges,
      remarks,
      warrantyPeriod,
    } = req.body;

console.log(req.body);

    if (!VendorRegisterID || !productID || !productName || !productCategory || !productPrice) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

  
    const vendor = await VendorRegisterForm.findOne({ _id: VendorRegisterID });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }

   
    const newProduct = new Product({
      VendorRegisterID: vendor._id,
      productID,
      productName,
      productCategory,
      productPrice,
      oneTimeCost,
      amcValue,
      dateOfPurchase,
      dateOfRenewal,
      otherCharges,
      remarks,
      warrantyPeriod,
    });
    console.log(newProduct);
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('VendorRegisterID', 'VendorName Email');
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found." });
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('VendorRegisterID', 'VendorName Email');
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.updateProduct = async (req, res) => {
  const {
    productID,
    productName,
    productCategory,
    productPrice,
    oneTimeCost,
    amcValue,
    dateOfPurchase,
    dateOfRenewal,
    otherCharges,
    remarks,
    warrantyPeriod,
  } = req.body;
  const { id } = req.params;

  try {
   
    if (
      !productID ||
      !productName ||
      !productCategory ||
      !productPrice ||
      !oneTimeCost ||
      !amcValue ||
      !dateOfPurchase ||
      !dateOfRenewal ||
      !otherCharges ||
      !remarks ||
      !warrantyPeriod
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

 
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productID,
        productName,
        productCategory,
        productPrice,
        oneTimeCost,
        amcValue,
        dateOfPurchase,
        dateOfRenewal,
        otherCharges,
        remarks,
        warrantyPeriod,
      },
      { new: true }
    ).populate('VendorRegisterID', 'VendorName Email');

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
