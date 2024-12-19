const BankDetails = require("../models/bankdetails");
const VendorRegisterForm = require("../models/vendor.js");




exports.createBankDetails = async (req, res) => {
  try {
    const { VendorRegisterID, AccountNumber, BankName, BranchName, IFSCCode } = req.body;


    if (!VendorRegisterID || !AccountNumber || !BankName || !BranchName || !IFSCCode) {
      return res.status(400).json({ error: "All fields are required." });
    }


    const vendor = await VendorRegisterForm.findOne({ _id: VendorRegisterID });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }

    const newBankDetails = new BankDetails({ VendorRegisterID, AccountNumber, BankName, BranchName, IFSCCode });
    await newBankDetails.save();

    res.status(201).json(newBankDetails);
  } catch (error) {
    console.error("Error creating bank details:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.getBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.find().populate("VendorRegisterID", "VendorName Email");
    if (!bankDetails || bankDetails.length === 0) {
      return res.status(404).json({ error: "No bank details found." });
    }
    res.json(bankDetails);
  } catch (error) {
    console.error("Error fetching bank details:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.getBankDetailsById = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findById(req.params.id).populate("VendorRegisterID", "VendorName Email");
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found." });
    }
    res.json(bankDetails);
  } catch (error) {
    console.error("Error fetching bank details by ID:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.updateBankDetails = async (req, res) => {
  const { VendorRegisterID, AccountNumber, BankName, BranchName, IFSCCode } = req.body;
  const { id } = req.params;

  try {
 
    if  (!AccountNumber || !BankName || !BranchName || !IFSCCode) {
      return res.status(400).json({ error: "All fields are required." });
    }

   
    const existingBankDetails = await BankDetails.findById(id);
    if (!existingBankDetails) {
      return res.status(404).json({ error: "Bank details not found." });
    }

    
    const updatedBankDetails = await BankDetails.findByIdAndUpdate(
      id,
      {  AccountNumber, BankName, BranchName, IFSCCode },
      { new: true }
    );

    res.status(200).json(updatedBankDetails);
  } catch (error) {
    console.error("Error updating bank details:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};



exports.deleteBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findByIdAndDelete(req.params.id);
    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found." });
    }
    res.json({ message: "Bank details deleted successfully." });
  } catch (error) {
    console.error("Error deleting bank details:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
