import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layouts.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Products() {
  const productsInputs = [
    {
      id: 1,
      name: "VendorRegisterID",
      label: "Vendor Register ID",
      placeholder: "Enter Vendor Registration ID",
      required: true,
    },
    {
      id: 2,
      name: "productID",
      label: "Product ID",
      type: "text",
      placeholder: "Enter Product ID",
      required: true,
    },
    {
      id: 3,
      name: "productName",
      label: "Product Name",
      type: "text",
      placeholder: "Enter Product Name",
      required: true,
    },
    {
      id: 4,
      name: "productCategory",
      label: "Product Category",
      type: "text",
      placeholder: "Enter Product Category",
      required: true,
    },
    {
      id: 5,
      name: "productPrice",
      label: "Product Price",
      type: "number",
      placeholder: "Enter Product Price",
      required: true,
    },
    {
      id: 6,
      name: "oneTimeCost",
      label: "One Time Cost",
      type: "number",
      placeholder: "Enter One Time Cost",
      required: true,
    },
    {
      id: 7,
      name: "amcValue",
      label: "AMC Value",
      type: "number",
      placeholder: "Enter AMC Value",
      required: true,
    },
    {
      id: 8,
      name: "dateOfPurchase",
      label: "Date of Purchase",
      type: "date",
      placeholder: "Enter Date of Purchase",
      required: true,
    },
    {
      id: 9,
      name: "dateOfRenewal",
      label: "Date of Renewal",
      type: "date",
      placeholder: "Enter Date of Renewal",
      required: true,
    },
    {
      id: 10,
      name: "otherCharges",
      label: "Other Charges",
      type: "number",
      placeholder: "Enter Other Charges",
      required: true,
    },
    {
      id: 11,
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      placeholder: "Enter Remarks",
      required: false,
    },
    {
      id: 12,
      name: "warrantyPeriod",
      label: "Warranty Period/Duration",
      type: "text",
      placeholder: "Enter Warranty Period (e.g., 1 Year)",
      required: false,
    },
    
  ];

  const [products, setProducts] = useState({
    VendorRegisterID: '',
    productID: '',
    productName: '',
    productCategory: '',
    productPrice: '',
    oneTimeCost: '',
    amcValue: '',
    dateOfPurchase: '',
    dateOfRenewal: '',
    otherCharges: '',
    remarks: '',
    warrantyPeriod: '',
  
  });

  const [vendorData, setVendorData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducts((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product data being submitted:", products); 
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/product/add-products`, products);
      if (response.status === 201) {
        toast.success('Product added successfully');
        setProducts({
          VendorRegisterID: '',
          productID: '',
          productName: '',
          productCategory: '',
          productPrice: '',
          oneTimeCost: '',
          amcValue: '',
          dateOfPurchase: '',
          dateOfRenewal: '',
          otherCharges: '',
          remarks: '',
          warrantyPeriod: '',
        });
      } else {
        toast.error(`Error: ${response.data.message || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Error: ${error.response?.data?.message || "Failed to add product"}`);
    }
  };
  
  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
      if(response.status === 200){
        console.log(response.data);

      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to load vendor data. Please try again.");
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <h2 className="text-center">Add New Product</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productsInputs.map((input) => (
                  <div key={input.id} className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">{input.label}</span>
                    </label>
                    {input.name === 'VendorRegisterID' ? (
                      <select
                        name={input.name}
                        value={products[input.name]}
                        onChange={handleChange}
                        required={input.required}
                        className="select select-bordered w-full max-w-xs"
                      >
                        <option value="">Select Vendor</option>
                        {vendorData.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                        {vendor.VendorRegisterID} - {vendor.VendorName}
                        </option>
                        ))}
                      </select>
                    ) : input.type === 'textarea' ? (
                      <textarea
                        name={input.name}
                        placeholder={input.placeholder}
                        value={products[input.name]}
                        onChange={handleChange}
                        required={input.required}
                        className="textarea textarea-bordered w-full max-w-xs"
                      />
                    ) : (
                      <input
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeholder}
                        value={products[input.name]}
                        onChange={handleChange}
                        required={input.required}
                        className="input input-bordered w-full max-w-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <button type="submit" className="custom-btn">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
     
    </Layout>
  );
}
