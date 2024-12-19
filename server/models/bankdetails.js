const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
  {
    VendorRegisterID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "VendorRegisterForm",
    },
    AccountNumber: { type: String,  },
    BankName: { type: String,  },
    BranchName: { type: String,  },
    IFSCCode: { type: String, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankDetails", bankDetailsSchema);
