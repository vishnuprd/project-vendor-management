const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    VendorRegisterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorRegisterForm",
    },
    productID: {
     type: String,
    },
    productName: {
      type: String,
    },
    productCategory: {
      type: String,
    },
    productPrice: {
      type: Number,
      min: 0,
    },
    oneTimeCost: {
      type: Number,
      min: 0,
    },
    amcValue: {
      type: Number,
      min: 0,
    },
    dateOfPurchase: {
      type: Date,
    },
    dateOfRenewal: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= this.dateOfPurchase;
        },
        message: "Date of renewal must be after date of purchase",
      },
    },
    otherCharges: {
      type: Number,
      min: 0,
    },
    remarks: {
      type: String,
    },
    warrantyPeriod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
