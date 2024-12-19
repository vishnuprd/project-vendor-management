import React, { useState, useRef, useEffect } from "react";
import Layout from "../layouts/layouts.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VendorTable() {
  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const modalRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`
        );
        setVendorData(response.data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to load vendor data. Please try again.");
      }
    };
    fetchVendorData();
  }, []);

  const handleOpenModal = (vendor) => {
    setSelectedVendor({ ...vendor });
    modalRef.current?.showModal();
  };


  const handleCloseModal = () => {
    modalRef.current?.close();
    setSelectedVendor(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    
   
    Object.keys(selectedVendor).forEach((key) => {
      if (key !== "imageUrl") {
        formData.append(key, selectedVendor[key]);
      }
    });
  
 
    if (selectedVendor.imageUrl instanceof File) {
     
      if (selectedVendor.imageUrl.size > 5 * 1024) {
        toast.error("Image file size exceeds the 5 KB limit");
        return; 
      }
      formData.append("imageUrl", selectedVendor.imageUrl);
    }
  
    try {
      await axios.put(
       `${process.env.REACT_APP_API_URL}/api/vendor/update-vendor/${selectedVendor._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("Failed to update vendor. Please try again.");
    }
  };
  
  
  const handleDeleteVendor = async (id) => {
    try {
      console.log("Deleting vendor with id:", id); 
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/vendor/delete-vendor/${id}`
      );
  
      if (response.status === 200) {
        toast.error("Vendor deleted successfully");
        handleCloseModal();
        setVendorData((prevVendors) =>
          prevVendors.filter((vendor) => vendor._id !== id)
        );
         

      } else {
        toast.error("Failed to delete vendor. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("An error occurred while deleting the vendor. Please try again.");
    }
  };
 
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    setSelectedVendor((prevState) => ({
      ...prevState,
      [name]: files && files.length > 0 ? files[0] : value, 
    }));
  };
  

  const[ searchfilters, setSearchFilters] = useState({});

  // console.log('searchfilters:', searchfilters);

const filteredData = vendorData.filter((vendor) => {
  const { VendorName = '', VendorType = '' } = searchfilters; 

  // console.log('VendorName:', VendorName);
  // console.log('VendorType:', VendorType);

  const vendorNameMatch =
    VendorName === '' || (vendor.VendorName && vendor.VendorName.toLowerCase().includes(VendorName.toLowerCase()));

  const vendorTypeMatch =
    VendorType === '' || (vendor.VendorType && vendor.VendorType.toLowerCase().includes(VendorType.toLowerCase()));

  return vendorNameMatch && vendorTypeMatch;
});



const handleFilterChange = (e) => {
  const { name, value } = e.target;
  console.log(`${name}: ${value}`);
  setSearchFilters((prev) => ({
    ...prev,
    [name]: value,
  }));
};



  const [pagination, setPagination] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (pagination - 1) * itemsPerPage;
  const endIndex = pagination * itemsPerPage;
  
 
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  const handleNextPage = () => {
    if (pagination < totalPages) {
      setPagination((prevPagination) => prevPagination + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (pagination > 1) {
      setPagination((prevPage) => prevPage - 1);
    }
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
    value={searchfilters.VendorName || ""}
    onChange={handleFilterChange}
    placeholder="Search Vendor Name"
    className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
  />

  <select
    name="VendorType"
    value={searchfilters.VendorType || ""}
    onChange={handleFilterChange}
    className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
  >
    <option value="">Select Vendor Type</option>
    {vendorData.map((vendor) => (
      <option key={vendor._id} value={vendor.VendorType}>
        {vendor.VendorType}
      </option>
    ))}
  </select>
</div>


        <div className="overflow-x-auto">
  <table className="table-auto w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2">#</th>
        <th className="border border-gray-300 p-2">Vendor ID</th>
        <th className="border border-gray-300 p-2">Vendor Name</th>
        <th className="border border-gray-300 p-2">Statuary Status</th>
        <th className="border border-gray-300 p-2">GST Number</th>
        <th className="border border-gray-300 p-2">Image/File</th>
        <th className="border border-gray-300 p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
       {paginatedData.map((vendor, index) => (
    <tr key={vendor._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <td className="border border-gray-300 p-2 text-center">{startIndex + index + 1}</td>
      <td className="border border-gray-300 p-2 text-center">{vendor.VendorRegisterID}</td>
      <td className="border border-gray-300 p-2 text-center">{vendor.VendorName}</td>
      <td className="border border-gray-300 p-2 text-center">{vendor.StatuaryStatus}</td>
      <td className="border border-gray-300 p-2 text-center">{vendor.GSTNumber}</td>
      <td className="border border-gray-300 p-2 text-center">
  {vendor.imageUrl ? (
    vendor.imageUrl.endsWith(".pdf") ? ( 
      <a
        href={`http://localhost:5000/${vendor.imageUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View PDF
      </a>
    ) : (
      <img
        src={`http://localhost:5000/${vendor.imageUrl}`} 
        alt="Vendor"
        className="h-20 w-20 object-cover mx-auto"
      />
    )
  ) : (
    "No File"
  )}
</td>



      <td className="border border-gray-300 p-2 text-center">
        <button
          className="text-gray-600 hover:text-blue-500"
          onClick={() => handleOpenModal(vendor)}
        >
          <i className="bx bxs-edit"></i>
        </button>
        <button
          className="text-gray-600 ml-4 hover:text-red-500"
          onClick={() => handleDeleteVendor(vendor._id)}
        >
          <i className="bx bxs-trash"></i>
        </button>
      </td>
    </tr>
  ))}
</tbody>
  </table>
</div>

  
          <dialog ref={modalRef} className="modal">
            {selectedVendor && (
              <div className="modal-box w-11/12 max-w-5xl">
                <h2 className="text-center mb-4">Edit Vendor</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Vendor ID
                      </label>
                      <input
                        type="text"
                        name="VendorRegisterID"
                        value={selectedVendor.VendorRegisterID}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
              
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Vendor Name
                      </label>
                      <input
                        type="text"
                        name="VendorName"
                        value={selectedVendor.VendorName || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                  
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Statuary Status
                      </label>
                      <select
                        name="StatuaryStatus"
                        value={selectedVendor.StatuaryStatus || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      >
                        <option value="" disabled>Select Statuary Status</option>
                        <option value="Sole proprietorship">Sole proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Limited Liability Company">Limited Liability Company</option>
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
  
                    {/* Vendor Type */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Vendor Type
                      </label>
                      <input
                        type="text"
                        name="VendorType"
                        value={selectedVendor.VendorType || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Date of Establishment */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Date of Establishment
                      </label>
                      <input
                        type="date"
                        name="DateOfEstablishment"
                        value={selectedVendor.DateOfEstablishment || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Registered Office Address */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Registered Office Address
                      </label>
                      <input
                        type="text"
                        name="RegisteredOfficeAddress"
                        value={selectedVendor.RegisteredOfficeAddress || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Factory Address */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Factory Address
                      </label>
                      <input
                        type="text"
                        name="FactoryAddress"
                        value={selectedVendor.FactoryAddress || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* GST Number */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="GSTNumber"
                        value={selectedVendor.GSTNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* PAN Number */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        name="PANNumber"
                        value={selectedVendor.PANNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* MSME Registration Number */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        MSME Registration Number
                      </label>
                      <input
                        type="text"
                        name="MSMERegistrationNumber"
                        value={selectedVendor.MSMERegistrationNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* CIN Number */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        CIN Number
                      </label>
                      <input
                        type="text"
                        name="CINNumber"
                        value={selectedVendor.CINNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Nearest Landmark */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Nearest Landmark
                      </label>
                      <input
                        type="text"
                        name="NearestLandmark"
                        value={selectedVendor.NearestLandmark || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Phone Number */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="PhoneNumber"
                        value={selectedVendor.PhoneNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
  
                    {/* Email */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Email
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={selectedVendor.Email || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Website
                      </label>
                      <input
                        type="text"
                        name="Website"
                        value={selectedVendor.Website || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                       NatureofBusiness
                      </label>
                      <input
                        type="text"
                        name="NatureofBusiness"
                        value={selectedVendor.NatureofBusiness || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                       TypeofBusiness
                      </label>
                      <input
                        type="text"
                        name="TypeofBusiness"
                        value={selectedVendor.TypeofBusiness || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                      ProductDetails
                      </label>
                      <input
                        type="text"
                        name="ProductDetails"
                        value={selectedVendor.ProductDetails || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                     TotalTurnoverPerAnnum
                      </label>
                      <input
                        type="text"
                        name="TotalTurnoverPerAnnum"
                        value={selectedVendor.TotalTurnoverPerAnnum || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                     TotalEmployees
                      </label>
                      <input
                        type="text"
                        name="TotalEmployees"
                        value={selectedVendor.TotalEmployees || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
  <label className="block mb-2 text-sm font-medium text-gray-900">
    Image Upload
  </label>
  <input
  type="file"
  name="imageUrl"
  accept="image/*,application/pdf"
  onChange={handleInputChange}
  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"

/>

</div>
  
                  
  <div className="col-span-full flex justify-center items-center gap-4">
  <button
    type="submit"
    className="custom-btn "
  >
    Save
  </button>
  <button
    type="button" 
    onClick={handleCloseModal}
    className="btn btn-grey "
  >
    Close
  </button>
</div>    
                  </div>
               
                </form>
                
              </div>
            )}
          </dialog>
          <div className="join justify-center">
          <button 
  className="join-item btn" 
  onClick={handlePreviousPage} 
  disabled={pagination === 1}
  style={{ color: "#4996ff" }}>
  &laquo; 
</button>

<button 
  className="join-item btn"
  style={{ color: "#4996ff" }}>
  
  {pagination}
</button>

<button 
  className="join-item btn" 
  onClick={handleNextPage} 
  disabled={pagination === totalPages}

  style={{ color: "#4996ff" }}>
  &raquo; 
</button>


</div>
        </div>
      </div>
    </div>
  </Layout>
)
};