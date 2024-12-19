import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layouts/layouts.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function BankTable() {
  const [banktableData, setBanktableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBankDetail, setSelectedBankDetail] = useState({
    AccountNumber: "",
    BankName: "",
    BranchName: "",
    IFSCCode: "",
  });

  const fetchBanktableData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-bankdetails`);
      setBanktableData(response.data);
    } catch (error) {
      console.error("Error fetching bank table data:", error);
      toast.error("Error fetching bank table data: " + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleModalOpen = (bankDetail) => {
    setSelectedBankDetail(bankDetail);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBankDetail({
      AccountNumber: "",
      BankName: "",
      BranchName: "",
      IFSCCode: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBankDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedBankDetail.AccountNumber || !selectedBankDetail.BankName || !selectedBankDetail.IFSCCode || !selectedBankDetail.BranchName) {
      alert("Please fill in all required fields (Account Number, Bank Name, IFSC Code).");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/vendor/update-bankdetails/${selectedBankDetail._id}`,
        {
          AccountNumber: selectedBankDetail.AccountNumber,
          BankName: selectedBankDetail.BankName,
          BranchName: selectedBankDetail.BranchName,
          IFSCCode: selectedBankDetail.IFSCCode,
        }
      );

      if (response.status === 200) {
       toast.success("Bank details updated successfully!");
        fetchBanktableData();
        handleModalClose();
      } else {
        toast.error("Error updating bank details: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Error updating bank details: " + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/vendor/delete-bankdetails/${id}`);
      setBanktableData((prevState) => prevState.filter((bankDetail) => bankDetail._id !== id));
      toast.success("Bank details deleted successfully!");
    } catch (error) {
      toast.error("Error deleting bank details: " + (error.response ? error.response.data.message : error.message));
      console.error("Error deleting bank details:", error);
    }
  };

  useEffect(() => {
    fetchBanktableData();
  }, []);

  const [searchFilters, setSearchFilters] = useState({});

  const filteredData = banktableData.filter((bank) => {
    const { VendorName = " ", BankName = " " } = searchFilters;
  
  
    console.log("searchFilters.VendorName:", searchFilters.VendorName);
    console.log("bank.VendorRegisterID.VendorName:", bank.VendorRegisterID?.VendorName);
  
   
    const VendorNameMatch =
      VendorName === " " ||
      (bank.VendorRegisterID?.VendorName && typeof bank.VendorRegisterID.VendorName === "string" &&
        bank.VendorRegisterID.VendorName.toLowerCase().includes(VendorName.trim().toLowerCase()));
  
    const BankNameMatch =
      BankName === " " ||
      (bank.BankName && typeof bank.BankName === "string" &&
        bank.BankName.toLowerCase().includes(BankName.trim().toLowerCase()));
  
    return VendorNameMatch && BankNameMatch;
  });
  
  

  const[page,setPage]= useState(1);

  const itemsPerPage=10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;

  const endIndex = page * itemsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);
  


  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPagination) => prevPagination + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };


 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`);  
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };
  


  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
              <div className="flex flex-col space-y-4">

              <div className="flex flex-row space-x-4 mb-4 justify-end">
              <input
  type="text"
  name="VendorName"
  value={searchFilters.VendorName || ""}
  onChange={handleFilterChange}
  placeholder="Search Vendor Name"
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
/>


        <select
          name="BankName"
          value={searchFilters.BankName || ""}
          onChange={handleFilterChange}
          className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Select Bank Name</option>
          {banktableData.map((bank) => (
            <option key={bank._id} value={bank.BankName}>
              {bank.BankName}
            </option>
          ))}
        </select>
</div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">#</th>
                    <th className="border border-gray-300 p-2">Vendor Name</th>
                    <th className="border border-gray-300 p-2">Account Number</th>
                    <th className="border border-gray-300 p-2">Bank Name</th>
                    <th className="border border-gray-300 p-2">Branch Name</th>
                    <th className="border border-gray-300 p-2">IFSC Code</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((bankDetail, index) => (
                    <tr key={bankDetail._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border px-4 py-2">{startIndex + index + 1}</td>
                      <td className="border px-4 py-2">{bankDetail.VendorRegisterID.VendorName}</td>
                      <td className="border px-4 py-2">{bankDetail.AccountNumber}</td>
                      <td className="border px-4 py-2">{bankDetail.BankName}</td>
                      <td className="border px-4 py-2">{bankDetail.BranchName}</td>
                      <td className="border px-4 py-2">{bankDetail.IFSCCode}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="text-gray-600 px-2 hover:text-blue-500"
                          onClick={() => handleModalOpen(bankDetail)}
                        >
                          <i className="bx bxs-edit"></i>
                        </button>
                        <button
                          className="text-gray-600  hover:text-red-500"
                          onClick={() => handleDelete(bankDetail._id)}
                        >
                          <i className="bx bxs-trash ml-2"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {modalOpen && selectedBankDetail && (
              <div className="modal-box w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
                <h2 className="text-center mb-4">Edit Bank Details</h2>
                <form onSubmit={handleUpdate}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Account Number</label>
                      <input
                        type="text"
                        name="AccountNumber"
                        value={selectedBankDetail.AccountNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Bank Name</label>
                      <input
                        type="text"
                        name="BankName"
                        value={selectedBankDetail.BankName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Branch Name</label>
                      <input
                        type="text"
                        name="BranchName"
                        value={selectedBankDetail.BranchName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">IFSC Code</label>
                      <input
                        type="text"
                        name="IFSCCode"
                        value={selectedBankDetail.IFSCCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button className="btn custom-btn" type="submit">Update</button>
                    <button
                      className="btn btn-grey"
                      type="button"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="join flex mt-4 justify-center">
          <button 
  className="join-item btn" 
  onClick={handlePreviousPage} 
  disabled={page === 1}
  style={{ color: "#4996ff" }}>
  &laquo; 
</button>

<button 
  className="join-item btn"
  style={{ color: "#4996ff" }}>
  
  {page}
</button>

<button 
  className="join-item btn" 
  onClick={handleNextPage} 
  disabled={page === totalPages}

  style={{ color: "#4996ff" }}>
  &raquo; 
</button>
        </div>
      </div>
      </div>
    </Layout>
  );
}
