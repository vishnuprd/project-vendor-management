import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/layouts.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Customer() {
  const customerInputs = [
    {
      id: 1,
      name: "VendorRegisterID",
      label: "Vendor Register ID",
      type: "text",
      placeholder: "Enter Vendor Register ID",
      required: true,
    },
    {
      id: 2,
      name: "productID",
      label: "Product ID",
      type: "text",
      placeholder: "Select Product ID",
      required: true,
    },
    {
      id: 3,
      name: "customerID",
      label: "Customer ID",
      type: "text",
      placeholder: "Enter Customer ID",
      required: true,
    },
    {
      id: 4,
      name: "customerName",
      label: "Customer Name",
      type: "text",
      placeholder: "Enter Customer Name",
      required: true,
    },
    {
      id: 5,
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Customer Email",
      required: true,
    },
    {
      id: 6,
      name: "contactNumber",
      label: "Contact Number",
      type: "tel",
      placeholder: "Enter Contact Number",
      required: true,
    },
    {
      id: 7,
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter Address",
      required: false,
    },
    {
      id: 8,
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter City",
      required: true,
    },
    {
      id: 9,
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Enter State",
      required: true,
    },
    {
      id: 10,
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Enter Country",
      required: true,
    },
  ];

  const [customerData, setCustomerData] = useState({
    VendorRegisterID: "",
    productID: "",
    customerID: "",
    customerName: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [vendorData, setVendorData] = useState([]);
  const [productData, setProductData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(customerData);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customer/add-customers`, customerData);
      console.log(response);
      if (response.status === 201) {
        toast.success("Customer registered successfully!");
        setCustomerData({
          VendorRegisterID: "",
          productID: "",
          customerID: "",
          customerName: "",
          email: "",
          contactNumber: "",
          address: "",
          city: "",
          state: "",
          country: "",
        });
      } else if (response.data.error) {
        toast.error(`${response.data.error}`);
      }
    } catch (error) {
      console.error("Error registering customer:", error);
      toast.error("Error while registering customer");
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to load vendor data. Please try again.");
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products`);
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert("Failed to load product data. Please try again.");
    }
  };

  useEffect(() => {
    fetchVendorData();
    fetchProductData();
  }, []);

  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <h2 className="text-center text-lg font-semibold mb-4">Customer Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {customerInputs.map((input) => (
                <div key={input.id}>
                  <label
                    htmlFor={input.name}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {input.label}
                  </label>
                  {input.name === "VendorRegisterID" ? (
                    <select
                      id={input.name}
                      name={input.name}
                      required={input.required}
                      value={customerData[input.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Vendor</option>
                      {vendorData.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.VendorRegisterID} - {vendor.VendorName}
                        </option>
                      ))}
                    </select>
                  ) : input.name === "productID" ? (
                    <select
                      id={input.name}
                      name={input.name}
                      required={input.required}
                      value={customerData[input.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Product</option>
                      {productData.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.productID} - {product.productName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      id={input.name}
                      name={input.name}
                      placeholder={input.placeholder}
                      required={input.required}
                      value={customerData[input.name]}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button type="submit" className="custom-btn">
                Register Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
