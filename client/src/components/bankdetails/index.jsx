import React, { useState, useEffect } from "react";
import Layout from "../layouts/layouts.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BankDetails() {
  const bankDetailsInputs = [
    {
      id: 2,
      name: "AccountNumber",
      label: "Account Number",
      type: "text",
      placeholder: "Enter Account Number",
      required: true,
    },
    {
      id: 3,
      name: "BankName",
      label: "Bank Name",
      type: "text",
      placeholder: "Enter Bank Name",
      required: true,
    },
    {
      id: 4,
      name: "BranchName",
      label: "Branch Name",
      type: "text",
      placeholder: "Enter Branch Name",
      required: true,
    },
    {
      id: 5,
      name: "IFSCCode",
      label: "IFSC Code",
      type: "text",
      placeholder: "Enter IFSC Code",
      required: true,
    },
  ];

  const [bankData, setBankData] = useState({
    VendorRegisterID: "",
    AccountNumber: "",
    BankName: "",
    BranchName: "",
    IFSCCode: "",
  });

  const [vendorList, setVendorList] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      if (response.status === 200) {
        setVendorList(response.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error fetching vendors. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankData({
      ...bankData,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(bankData);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/vendor/add-bankdetails`, bankData);
      if (response.status === 201) {
        toast.success("Bank details added successfully!");
      } else {
        toast.error("Error adding bank details");
      }
    } catch (error) {
      console.error("Error adding bank details:", error);
      toast.error("Error adding bank details. Please try again later.");
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <h2 className="text-center text-lg font-semibold mb-4">Vendor Bank Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="w-full">
                <label
                  htmlFor="VendorRegisterID"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Vendor Register ID
                </label>
                <select
                  id="VendorRegisterID"
                  name="VendorRegisterID"
                  value={bankData.VendorRegisterID}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>
                  {vendorList.length > 0 ? (
                    vendorList.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.VendorRegisterID} - {vendor.VendorName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No vendors available
                    </option>
                  )}
                </select>
              </div>

              {bankDetailsInputs.map((input) => (
                <div key={input.id} className="w-full">
                  <label
                    htmlFor={input.name}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    id={input.name}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={bankData[input.name] || ""}
                    onChange={handleChange}
                    required={input.required}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Submit Bank Details
              </button>
            </div>
          </form>
        </div>
      </div>

    </Layout>
  );
}
