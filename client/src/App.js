import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminlogin from "./components/adminlogin/index.jsx";
import Adminsignup from "./components/adminsignup/index.jsx";
import Dashboard from "./components/dashboard/index.jsx";
import VendorRegistration from "./components/vendorregistration/index.jsx";
import Vendortable from "./components/vendortable/index.jsx";
import Bankdetails from "./components/bankdetails/index.jsx";
import Customer from "./components/customer/index.jsx";
import Products from "./components/products/index.jsx";
import BankTable from "./components/banktable/index.jsx";
import ProductTable from "./components/producttable/index.jsx";
import CustomerTable from "./components/customertable/index.jsx";
import SalesReport from "./components/report/index.jsx";
import PrivateRoutes from "./components/layouts/protected-route.js";
import { AuthProvider } from "./components/layouts/authcontent.js";
import { ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';   

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
           
            <Route path="/" element={<Adminlogin />} />
            <Route path="/admin-signup" element={<Adminsignup />} />

          
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vendor-registration" element={<VendorRegistration />} />
              <Route path="/vendor-list" element={<Vendortable />} />
              <Route path="/bank-details" element={<Bankdetails />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/products" element={<Products />} />
              <Route path="/bank-list" element={<BankTable />} />
              <Route path="/product-list" element={<ProductTable />} />
              <Route path="/customer-list" element={<CustomerTable />} />
              <Route path="/report" element={<SalesReport />} />
            </Route>
          </Routes>
          <ToastContainer  position="top-right"/>  
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
