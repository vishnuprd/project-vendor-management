import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Stats() {
  const [vendorData, setVendorData] = useState([]);
  const [banktableData, setBanktableData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      alert("Failed to load vendor data. Please try again.");
    }
  };

  const fetchBanktableData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-bankdetails`);
      setBanktableData(response.data);
    } catch (error) {
      console.error("Error fetching bank details data:", error);
      alert("Failed to load bank details data. Please try again.");
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

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customer/get-customers`);
      if (response.status === 200) {
        setCustomerData(response.data);
      } else {
        console.log("Error fetching customer data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    fetchVendorData();
    fetchBanktableData();
    fetchProductData();
    fetchCustomerData();
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div className="flex flex-col space-y-4">
          <h2 className="text-center text-xl font-bold">Statistics</h2>

          <div className="stats grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shadow">
            <div className="stat text-center justify-items-center p-4 bg-white rounded shadow-md">
              <div className="stat-title text-bold">Total Vendors</div>
              <div className="stat-value"  style={{ color: "ffa600" }}>{vendorData.length}</div>
              <div className="stat-desc">Registered in the system</div>
            </div>

         
            <div className="stat text-center justify-items-center p-4 bg-white rounded shadow-md">
              <div className="stat-title text-bold">Total Bank Accounts</div>
              <div className="stat-value" style={{ color: "#003f5c" }} >{banktableData.length}</div>
              <div className="stat-desc">Linked to vendors</div>
            </div>

            <div className="stat text-center justify-items-center p-4 bg-white rounded shadow-md">
              <div className="stat-title text-bold">Products List</div>
              <div className="stat-value" style={{ color: "#ff6361" }} >{productData.length}</div>
              <div className="stat-desc">Registered in the system</div>
            </div>

          
            <div className="stat text-center justify-items-center p-4 bg-white rounded shadow-md">
              <div className="stat-title text-bold">Customer List</div>
              <div className="stat-value"style={{ color: "#58508d" }} >{customerData.length}</div>
              <div className="stat-desc">Registered in the system</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
