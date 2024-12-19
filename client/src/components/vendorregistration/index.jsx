import React, { useState, useRef } from "react";
import Layout from "../layouts/layouts.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VendorRegistration() {
  const VendorRegistrationInputs = [
    { id: 1, name: "VendorRegisterID", label: "Vendor Register ID", type: "text", placeholder: "Enter Vendor Registration ID", required: true },
    { id: 2, name: "VendorName", label: "Vendor Name", type: "text", placeholder: "Enter Vendor Name", required: true },
    { id: 3, name: "StatuaryStatus", label: "Statuary Status", type: "select", options: ["Sole proprietorship", "Partnership", "Limited Liability Company", "Private Limited Company", "Others"], required: true },
    { id: 4, name: "VendorType", label: "Vendor Type", type: "text", placeholder: "Enter Vendor Type", required: true },
    { id: 5, name: "DateOfEstablishment", label: "Date Of Establishment", type: "date", required: true },
    { id: 6, name: "RegisteredOfficeAddress", label: "Registered Office Address", type: "textarea", placeholder: "Enter Address", required: true },
    { id: 7, name: "FactoryAddress", label: "Factory Address", type: "text", placeholder: "Enter Factory Address" },
    { id: 8, name: "GSTNumber", label: "GST Number", type: "text", placeholder: "Enter GST Number", required: true },
    { id: 9, name: "PANNumber", label: "PAN Number", type: "text", placeholder: "Enter PAN Number", required: true },
    { id: 10, name: "MSMERegistrationNumber", label: "MSME Registration Number", type: "text", placeholder: "Enter MSME Registration Number" },
    { id: 11, name: "CINNumber", label: "CIN Number", type: "text", placeholder: "Enter CIN Number" },
    { id: 12, name: "NearestLandmark", label: "Nearest Landmark", type: "text", placeholder: "Enter Nearest Landmark" },
    { id: 13, name: "PhoneNumber", label: "Phone Number", type: "text", placeholder: "Enter Phone Number", required: true },
    { id: 14, name: "Email", label: "Email", type: "email", placeholder: "Enter Email", required: true },
    { id: 15, name: "Website", label: "Website", type: "text", placeholder: "Enter Website" },
    { id: 16, name: "NatureofBusiness", label: "Nature of Business", type: "text", placeholder: "Enter Nature of Business", required: true },
    { id: 17, name: "TypeofBusiness", label: "Type of Business", type: "text", placeholder: "Enter Type of Business", required: true },
    { id: 18, name: "ProductDetails", label: "Product Details", type: "text", placeholder: "Enter Product Details", required: true },
    { id: 19, name: "TotalTurnoverPerAnnum", label: "Turnover Per Annum", type: "text", placeholder: "Enter Turnover Per Annum" },
    { id: 20, name: "TotalEmployees", label: "Total Employees", type: "text", placeholder: "Enter Total Employees" },
    { id: 21, name: "imageUrl", label: "File Upload(5MB)", type: "file" , required: true },
  ];

  const [vendorData, setVendorData] = useState({
    VendorRegisterID: "",
    VendorName: "",
    StatuaryStatus: "",
    VendorType: "",
    DateOfEstablishment: "",
    RegisteredOfficeAddress: "",
    FactoryAddress: "",
    GSTNumber: "",
    PANNumber: "",
    MSMERegistrationNumber: "",
    CINNumber: "",
    NearestLandmark: "",
    PhoneNumber: "",
    Email: "",
    Website: "",
    NatureofBusiness: "",
    TypeofBusiness: "",
    ProductDetails: "",
    TotalTurnoverPerAnnum: "",
    TotalEmployees: "",
    imageUrl: null,
  });

  const [errors, setErrors] = useState({});
  const fileInput = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUrl") {
      setVendorData((prev) => ({ ...prev, imageUrl: files[0] }));
    } else {
      setVendorData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;

    if (!vendorData.VendorRegisterID) {
      validationErrors.VendorRegisterID = "Vendor Register ID is required";
      isValid = false;
    }
    if (!vendorData.VendorName) {
      validationErrors.VendorName = "Vendor Name is required";
      isValid = false;
    }
    if (!vendorData.Email || !/\S+@\S+\.\S+/.test(vendorData.Email)) {
      validationErrors.Email = "Valid Email is required";
      isValid = false;
    }
    if (!vendorData.PhoneNumber || vendorData.PhoneNumber.length < 10) {
      validationErrors.PhoneNumber = "Valid Phone Number is required";
      isValid = false;
    }
    if (!vendorData.GSTNumber) {
      validationErrors.GSTNumber = "GST Number is required";
      isValid = false;
    }
    if (!vendorData.PANNumber) {
      validationErrors.PANNumber = "PAN Number is required";
      isValid = false;
    }

    if (!vendorData.imageUrl) {
      validationErrors.imageUrl = "File is required";
      isValid = false;
    }
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const formData = new FormData();
  
   
    if (vendorData.imageUrl) {
      if (vendorData.imageUrl.size > 10 * 1024 * 1024) {  
        toast.error("Image file size exceeds the 5 KB limit");
        return;  
      }
      formData.append("imageUrl", vendorData.imageUrl);
    }
  
  
    if (vendorData.pdfFile) {
      if (vendorData.pdfFile.size > 10 * 1024 * 1024) {  
        toast.error("PDF file size exceeds the 5 KB limit");
        return;  
      }
      formData.append("pdfFile", vendorData.pdfFile);
    }
  
   
    Object.keys(vendorData).forEach((key) => {
      if (key !== "imageUrl" && key !== "pdfFile") {
        formData.append(key, vendorData[key]);
      }
    });
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/vendor/add-vendor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setVendorData({});
      console.log(response.data);
      toast.success("Vendor registered successfully");
    
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to register vendor. Please try again.");
    }
  };
  
  


  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-300 shadow-md rounded-md bg-white">
          <h2 className="text-center">Vendor Registration</h2>
          <form onSubmit={handleSubmit}>
            {VendorRegistrationInputs.map((input) => (
              <div key={input.id} className="mb-4">
                <label htmlFor={input.name} className="block text-gray-700">{input.label}</label>
                {input.type === "select" ? (
                  <select
                    name={input.name}
                    id={input.name}
                    value={vendorData[input.name]}
                    onChange={handleChange}
                    required={input.required}
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Select {input.label}</option>
                    {input.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : input.type === "textarea" ? (
                  <textarea
                    name={input.name}
                    id={input.name}
                    value={vendorData[input.name]}
                    onChange={handleChange}
                    required={input.required}
                    placeholder={input.placeholder}
                    className="border p-2 w-full rounded"
                  />
                ) : input.type === "file" ? (
                  <input
  ref={fileInput}
  type="file"
  name="imageUrl"
  accept="image/*,application/pdf"  
  onChange={handleChange}
  required={input.required}
  className="border p-2 w-full rounded"
/>


                ) : (
                  <input
                    type={input.type}
                    name={input.name}
                    value={vendorData[input.name]}
                    onChange={handleChange}
                    required={input.required}
                    placeholder={input.placeholder}
                    className="border p-2 w-full rounded"
                  />
                )}
                {errors[input.name] && (
                  <p className="text-red-500 text-sm">{errors[input.name]}</p>
                )}
              </div>
            ))}
            <button
  type="submit"
  className="custom-btn mx-auto flex justify-center text-white px-4 py-2 rounded mt-4"
>
  Register Vendor
</button>

          </form>
        </div>
      </div>
    </Layout>
  );
}
