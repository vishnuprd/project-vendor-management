import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';  
import Layout from '../layouts/layouts.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerTable() {
    const [customerData, setCustomerData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const[searchFilters, setSearchFilters] = useState({
        VendorName: '',
    });

    const modalRef = useRef(null);

    
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
            toast.error("Failed to load customer data. Please try again.");
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    
    const handleOpenModal = (customer) => {
        setSelectedCustomer(customer);
        setModalOpen(true);
    };


    const handleCloseModal = () => {
        setModalOpen(false);
    };

    //
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/customer/customers/${selectedCustomer._id}`,
                selectedCustomer
            );
            if (response.status === 200) {
                fetchCustomerData();  
                handleCloseModal();
                toast.success("Customer updated successfully!");
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            toast.error("Error updating customer. Please try again.");
        }
    };

    const handleDeleteCustomer = async (customerID) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/customer/customers/${customerID}`
            );
    
            if (response.status === 200) {
                setCustomerData((prevState) =>
                    prevState.filter((customer) => customer._id !== customerID)
                );
                toast.success("Customer deleted successfully!"); 
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
            toast.error("Error deleting customer. Please try again.");
        }
    };
    
   
    const [searchfilters, setSearchfilters] = useState({
        VendorName: "",
        city: "",
      });

      const filteredData = customerData.filter((customer) => {
        const { VendorName = "", city = "" } = searchfilters;
      
        console.log("searchFilters.VendorName:", searchfilters.VendorName);
        console.log("customer.VendorRegisterID?.VendorName:", customer.VendorRegisterID?.VendorName);
      
        const VendorNameMatch =
          VendorName === "" ||
          (customer.VendorRegisterID?.VendorName &&
            customer.VendorRegisterID?.VendorName.toLowerCase().includes(VendorName.toLowerCase()));
      
        const cityMatch =
          city === "" ||
          (customer.city &&
            customer.city.toLowerCase().includes(city.toLowerCase()));
      
        return VendorNameMatch && cityMatch;
      });
      
      
const[page,setPage]= useState(1)

const itemsPerPage = 10;

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
  
    setSearchfilters((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

    
    return (
        <div>
            <Layout>
                <div className="p-4 sm:ml-64">
                    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <div className="overflow-auto max-h-[500px]">
                    <div className="flex flex-row space-x-4 mb-4 justify-end">
                    <input
  type="text"
  name="VendorName"
  value={searchfilters.VendorName || ""}  
  onChange={handleFilterChange}
  placeholder="Search Vendor Name"
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
/>


<select
  name="city"
  value={searchfilters.city || ""}
  onChange={handleFilterChange}
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
>
  <option value="">Select City</option>
  {customerData.map((customer) => (
    <option key={customer._id} value={customer.city}>
      {customer.city}
    </option>
  ))}
</select>

</div>


    <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
            <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Vendor Name</th>
                <th className="border border-gray-300 p-2">Product ID</th>
                <th className="border border-gray-300 p-2">Customer ID</th>
                <th className="border border-gray-300 p-2">Customer Name</th>
                <th className="border border-gray-300 p-2">Email Address</th>

            </tr>
        </thead>
        <tbody>
            {paginatedData.map((customer, index) => (
                <tr key={customer.customerID}  className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 p-2 text-center">{startIndex + index + 1}</td>
                    <td className="border border-gray-300 p-2 text-center">{customer.VendorRegisterID.VendorName}</td>
                    <td className="border border-gray-300 p-2 text-center">{customer.productID._id}</td>
                    <td className="border border-gray-300 p-2 text-center">{customer.customerID}</td>
                    <td className="border border-gray-300 p-2 text-center">{customer.customerName}</td>

                    <td className="border border-gray-300 p-2">
                        <button
                            className="text-gray-600 px-4 hover:text-blue-500"
                            onClick={() => handleOpenModal(customer)}
                        >
                            <i className="bx bxs-edit"></i>
                        </button>

                        <button
                            className="text-gray-600 px-4 hover:text-red-500"
                            onClick={() => handleDeleteCustomer(customer._id)}

                        >
                            <i className="bx bxs-trash"></i>
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


                        {modalOpen && (
                            <dialog ref={modalRef} open className="modal">
                                <div className="modal-box w-11/12 max-w-5xl">
                                    <h2 className="text-center mb-4">Edit Customer</h2>
                                    <form onSubmit={handleUpdateCustomer}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Vendor Name</label>
                                                <input
                                                    type="text"
                                                    name="VendorName"
                                                    value={selectedCustomer?.VendorRegisterID.VendorName  || ''}
                                                    disabled
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Product ID</label>
                                                <input
                                                    type="text"
                                                    name="productID"
                                                    value={selectedCustomer?.productID._id|| ''}
                                                    disabled
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    value={selectedCustomer?.customerName || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={selectedCustomer?.email || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Contact Number</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    value={selectedCustomer?.contactNumber || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={selectedCustomer?.city || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={selectedCustomer?.state || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={selectedCustomer?.country || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-4 mt-4">
                                            <button
                                                type="submit"
                                                className="custom-btn"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCloseModal}
                                                className="btn btn-grey"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
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
                
            </Layout>
        </div>
    );
}
