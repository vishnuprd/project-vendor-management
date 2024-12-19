const mongoose = require('mongoose');

const VendorRegisterFormSchema = new mongoose.Schema({
  VendorRegisterID: {
    type: String,
    required: true,
    unique: true,
  },
  VendorName: {
    type: String,
    required: true,
  },
  StatuaryStatus: {
    type: String,
  },
  VendorType: {
    type: String,
  },
  DateOfEstablishment: {
    type: Date,
  },
  RegisteredOfficeAddress: {
    type: String,
  },
  FactoryAddress: {
    type: String,
  },
  GSTNumber: {
    type: String,
    unique: true,
  },
  PANNumber: {
    type: String,
    unique: true,
  },
  MSMERegistrationNumber: {
    type: String,
  },
  CINNumber: {
    type: String,
  },
  NearestLandmark: {
    type: String,
  },
  PhoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Website: {
    type: String,
  },
  NatureofBusiness: {
    type: String,
  },
  TypeofBusiness: {
    type: String,
  },
  ProductDetails: {
    type: String,
  },
  TotalTurnoverPerAnnum: {
    type: Number,
  },
  TotalEmployees: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('VendorRegisterForm', VendorRegisterFormSchema);
