import React, { useState, useEffect, useRef } from 'react';
import Layout from '../layouts/layouts.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductTable() {
  const [productData, setProductData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);



  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };



  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products`);
      setProductData(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to load product data. Please try again.');
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      toast.error('Failed to load vendor data. Please try again.');
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchProductData();
    fetchVendorData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/product/products/${selectedProduct._id}`,
        selectedProduct
      );
      toast.success('Product updated successfully!');
      fetchProductData();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };


  const handleDeleteProduct = async (product) => {
    if (!product || !product._id) {
      console.error("Error: Missing product or product ID");
      toast.error("Failed to delete product. Invalid product data.");
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/product/products/${product._id}`);
      setProductData((prevState) =>
        prevState.filter((p) => p._id !== product._id)
      );
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };
  

  const[searchfilters,setSearchfilters]= useState({})

  const filteredData = productData.filter((product) => {
    const { productName = "", productCategory = "", dateOfRenewal = "" } = searchfilters;
  
    const productNameMatch =
      productName === "" ||
      (product.productName &&
        product.productName.toLowerCase().includes(productName.toLowerCase()));
  
    const productCategoryMatch =
      productCategory === "" ||
      (product.productCategory &&
        product.productCategory.toLowerCase().includes(productCategory.toLowerCase()));
  
    const dateOfRenewalMatch =
      dateOfRenewal === "" ||
      (product.dateOfRenewal &&
        formatDate(product.dateOfRenewal) === dateOfRenewal); 
    return productNameMatch && productCategoryMatch && dateOfRenewalMatch;
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
    setSearchfilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  


  return (
    <Layout>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="overflow-x-auto">
       
          <div className="flex flex-row space-x-4 mb-4 justify-end">

          <select
  name="productName"
  value={searchfilters.productName || ""}
  onChange={handleFilterChange}
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
>
  <option value="">Select Product Name</option>
  {productData.map((product) => (
    <option key={product._id} value={product.productName}>
      {product.productName}
    </option>
  ))}
</select>

<select
  name="productCategory"
  value={searchfilters.productCategory || ""}
  onChange={handleFilterChange}
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
>
  <option value="">Select Product Category</option>
  {productData.map((product) => (
    <option key={product._id} value={product.productCategory}>
      {product.productCategory}
    </option>
  ))}
</select>

<select
  name="dateOfRenewal"
  value={searchfilters.dateOfRenewal || ""}
  onChange={handleFilterChange}
  className="w-1/4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
>
  <option value="">Select Date of Renewal</option>
  {productData.map((product) => (
    <option key={product._id} value={formatDate(product.dateOfRenewal)}>
      {formatDate(product.dateOfRenewal)}
    </option>
  ))}
</select>

</div>


            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">#</th>
                  <th className="border border-gray-300 p-2">Vendor Name</th>
                  <th className="border border-gray-300 p-2 ">Product Name</th>
                  <th className="border border-gray-300 p-2">Product Category</th>
                  <th className="border border-gray-300 p-2">Product Price</th>
                  <th className="border border-gray-300 p-2">Date of Purchase</th>
                  <th className="border border-gray-300 p-2">Date of Renewal</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((product, index) => (
                  <tr key={product._id}  className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 p-2 text-center">{startIndex + index + 1}</td>
                    <td className="border border-gray-300 p-2 text-center">{product.VendorRegisterID.VendorName}</td>
                    <td className="border border-gray-300 p-2 text-center text-wrap">{product.productName}</td>
                    <td className="border border-gray-300 p-2 text-center">{product.productCategory}</td>
                    <td className="border border-gray-300 p-2 text-center">{product.productPrice}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDate(product.dateOfPurchase)}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDate(product.dateOfRenewal)}</td>
                    <td className="border border-gray-300 p-2 text-center">
                    <button
    className="text-gray-600 hover:text-blue-500"
    onClick={() => handleOpenModal(product)} defined
  >
    <i className="bx bxs-edit"></i>
  </button>

 
  <button
    className="text-red-500 hover:text-red-700 ml-2"
    onClick={() => handleDeleteProduct(product)}
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
                <h2 className="text-center">Edit Product</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Vendor Name</label>
                      <input
                        type="text"
                        name="VendorRegisterName"
                        value={selectedProduct.VendorRegisterID._id || ''}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Product ID</label>
                      <input
                        type="text"
                        name="productID"
                        value={selectedProduct.productID || ''}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                      <input
                        type="text"
                        name="productName"
                        value={selectedProduct.productName || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Product category</label>
                      <input
                        type="text"
                        name="productCategory"
                        value={selectedProduct.productCategory|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">One Time Cost</label>
                      <input
                        type="number"
                        name="productPrice"
                        value={selectedProduct.productPrice|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                      <input
                        type="number"
                        name="oneTimeCost"
                        value={selectedProduct.oneTimeCost|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">AMC Value</label>
                      <input
                        type="number"
                        name="amcValue"
                        value={selectedProduct.amcValue|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Date Of Purchase</label>
                      <input
                        type="date"
                        name="dateOfPurchase"
                        value={selectedProduct.dateOfPurchase|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Date Of Renewal</label>
                      <input
                        type="date"
                        name="dateOfRenewal"
                        value={selectedProduct.dateOfRenewal|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                   

                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Other Charges</label>
                      <input
                        type="number"
                        name="otherCharges"
                        value={selectedProduct.otherCharges|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Remarks</label>
                      <input
                        type="text"
                        name="remarks"
                        value={selectedProduct.remarks|| ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Warranty Period</label>
                      <input
                        type="text"
                        name="warrantyPeriod"
                        value={selectedProduct.warrantyPeriod|| ''}
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
  );
}
