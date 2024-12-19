import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Layout from "../layouts/layouts.js";

const Report = () => {
  const [vendorData, setVendorData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [selectedStep, setSelectedStep] = useState("customer"); 


  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      alert("Failed to load vendor data. Please try again.");
    }
  };

  const fetchBankData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-bankdetails`);
      setBankData(response.data);
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
    fetchBankData();
    fetchProductData();
    fetchCustomerData();
  }, []);

 
  const generateProductPDF = (product) => {
    const doc = new jsPDF();
    doc.setFontSize(18);

    const formattedDateOfPurchase = new Date(product.dateOfPurchase).toLocaleString();
    const formattedDateOfRenewal = new Date(product.dateOfRenewal).toLocaleString();
    
    const createdAt = new Date(product.createdAt);
    const formattedDate = createdAt.toLocaleString();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

  
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'bold'); 
    doc.text("Product Report", pageWidth / 2, 20, { align: 'center' });

   
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F'); 
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'italic'); 
    doc.text("Product Data - Generated with Care", pageWidth / 2, pageHeight - 10, { align: 'center' });

  
    const ProductReportText = `Product Report: ${product.BankName}`;
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(22); 
    doc.text(ProductReportText, pageWidth / 2, 40, { align: 'center' });

   
    const dateText = `Generated on: ${formattedDate}`;
    doc.setFontSize(12); 
    doc.text(dateText, pageWidth / 2, 50, { align: 'center' });

  
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55); 
    doc.setLineWidth(0.1);



    const productTable = [
    ["Vendor ID", product.VendorRegisterID._id],
    ["Vendor Name", product.VendorRegisterID.VendorName],
    ["Vendor Email", product.VendorRegisterID.Email],
      ["Product ID", product.productID],
      ["Name", product.productName],
      ["Category", product.productCategory],
      ["Price", product.productPrice],
      ["One Time Cost",product.oneTimeCost],
      ["Purchase Date", formattedDateOfPurchase],
      ["Date Of Renewal", formattedDateOfRenewal],
      ["Other Charges If Any",product.otherCharges],
      ["Remarks", product.remarks],
      ["Warranty Period", product.warrantyPeriod],
    ]
    
    doc.autoTable({
      startY: 60,
      head: [["Field", "Value"]],
      body: productTable,
      theme: 'grid', 
      headStyles: { 
          fillColor: [0, 123, 255], 
          textColor: [255, 255, 255], 
          fontSize: 14, 
          fontStyle: 'bold',
          halign: 'center'  
      },
      bodyStyles: { 
          fontSize: 12, 
          halign: 'center', 
          valign: 'middle',
          textColor: [0, 0, 0] 
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, 
      margin: { top: 10, left: 20, right: 20 },
      styles: {
          cellPadding: 5, 
          overflow: 'linebreak',
      }
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("For any inquiries, please contact support Team ", pageWidth / 2, pageHeight - 23, { align: 'center' });


    
    doc.save(`Product_Report_${product.productName}.pdf`);
  };


  const generateVendorPDF = (vendor) => {
    const doc = new jsPDF();
    doc.setFontSize(18);


    const createdAt = new Date(vendor.createdAt);
    const formattedDate = createdAt.toLocaleString();
    const formattedDateOfEstablishment= new Date(vendor.DateOfEstablishment).toLocaleString();
 
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

  
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'bold'); 
    doc.text("Vendor Report", pageWidth / 2, 20, { align: 'center' });

   
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F'); 
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'italic'); 
    doc.text("Vendor Data - Generated with Care", pageWidth / 2, pageHeight - 10, { align: 'center' });

  
    const VendorReportText = `Vendor Name: ${vendor.VendorName}`;
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(22); 
    doc.text(VendorReportText, pageWidth / 2, 40, { align: 'center' });

   
    const dateText = `Generated on: ${formattedDate}`;
    doc.setFontSize(12); 
    doc.text(dateText, pageWidth / 2, 50, { align: 'center' });

  
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55); 
    doc.setLineWidth(0.1);

  
    // doc.text(VendorReportText, pageWidth / 2, 20, { align: 'center' });
    // doc.text(dateText, pageWidth / 2, 30, { align: 'center' });
    

    const vendorTable = [
      ["Vendor ID", vendor.VendorRegisterID],
      ["Vendor Name", vendor.VendorName],
      ["Statuary Status", vendor.StatuaryStatus],
      ["Vendor Type", vendor.VendorType],
      ["Date Of Establishment", formattedDateOfEstablishment],
      ["Registered Office Address",vendor.RegisteredOfficeAddress],
      ["Factory Address",vendor.FactoryAddress],
      ["GST Number",vendor.GSTNumber],
      ["Pan Number",vendor.PANNumber],
      ["MEME Registration Number",vendor.MSMERegistrationNumber],
      ["CIN Number",vendor.CINNumber],
      ["Nearest LandMark", vendor.NearestLandmark],
      ["Phone Number",vendor.PhoneNumber],
      ["Vendor Email", vendor.Email],
      ["Vendor Website",vendor.Website],
      ["Nature Of Business",vendor.NatureofBusiness],
      ["Type of Business",vendor.TypeofBusiness],
      ["Product Details",vendor.ProductDetails],
      ["Total Turn-over Per Annum", vendor.TotalTurnoverPerAnnum],
      ["Total Employees",vendor.TotalEmployees]
    ];

    doc.autoTable({
      startY: 60,
      head: [["Field", "Value"]],
      body: vendorTable,
      theme: 'grid', 
      headStyles: { 
          fillColor: [0, 123, 255], 
          textColor: [255, 255, 255], 
          fontSize: 14, 
          fontStyle: 'bold',
          halign: 'center'  
      },
      bodyStyles: { 
          fontSize: 12, 
          halign: 'center', 
          valign: 'middle',
          textColor: [0, 0, 0] 
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, 
      margin: { top: 10, left: 20, right: 20 },
      styles: {
          cellPadding: 5, 
          overflow: 'linebreak',
      }
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("For any inquiries, please contact support Team ", pageWidth / 2, pageHeight - 30, { align: 'center' });



    doc.save(`Vendor_Report_${vendor.VendorName}.pdf`);
  };

  
  const generateBankPDF = (bank) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
  
   
    const createdAt = new Date(bank.createdAt);
    const formattedDate = createdAt.toLocaleString(); 
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

  
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'bold'); 
    doc.text("Bank Report", pageWidth / 2, 20, { align: 'center' });

   
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F'); 
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'italic'); 
    doc.text("Bank Data - Generated with Care", pageWidth / 2, pageHeight - 10, { align: 'center' });

  
    const BankReportText = `Bank Name: ${bank.BankName}`;
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(22); 
    doc.text(BankReportText, pageWidth / 2, 40, { align: 'center' });

   
    const dateText = `Generated on: ${formattedDate}`;
    doc.setFontSize(12); 
    doc.text(dateText, pageWidth / 2, 50, { align: 'center' });

  
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55); 
    doc.setLineWidth(0.1);

  
   
    const bankTable = [
      ["Vendor ID", bank.VendorRegisterID._id],
      ["Vendor Name", bank.VendorRegisterID.VendorName],
      ["Vendor Email", bank.VendorRegisterID.Email],
      ["Bank Name", bank.BankName],
      ["Branch Name", bank.BranchName],
      ["Account Number", bank.AccountNumber],
      ["IFSC Code", bank.IFSCCode],
    //   ["Created At", formattedDate]  
    ];
    
   
    doc.autoTable({
      startY: 60,
      head: [["Field", "Value"]],
      body: bankTable,
      theme: 'grid', 
      headStyles: { 
          fillColor: [0, 123, 255], 
          textColor: [255, 255, 255], 
          fontSize: 14, 
          fontStyle: 'bold',
          halign: 'center'  
      },
      bodyStyles: { 
          fontSize: 14, 
          halign: 'center', 
          valign: 'middle',
          textColor: [0, 0, 0] 
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }, 
      margin: { top: 10, left: 20, right: 20 },
      styles: {
          cellPadding: 5, 
          overflow: 'linebreak',
      }
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("For any inquiries, please contact support Team ", pageWidth / 2, pageHeight - 30, { align: 'center' });


  
  
    doc.save(`Bank_Report_${bank.BankName}.pdf`);
  };

  

  
  const generateCustomerPDF = (customer) => {
    const doc = new jsPDF();
    doc.setFontSize(18);

  
    const createdAt = new Date(customer.createdAt);
    const formattedDate = createdAt.toLocaleString();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

  
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'bold'); 
    doc.text("Customer Report", pageWidth / 2, 20, { align: 'center' });

   
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F'); 
    doc.setTextColor(255, 255, 255); 
    doc.setFont('helvetica', 'italic'); 
    doc.text("Customer Data - Generated with Care", pageWidth / 2, pageHeight - 10, { align: 'center' });

  
    const CustomerReportText = `Customer Name: ${customer.customerName}`;
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(22); 
    doc.text(CustomerReportText, pageWidth / 2, 40, { align: 'center' });

   
    const dateText = `Generated on: ${formattedDate}`;
    doc.setFontSize(12); 
    doc.text(dateText, pageWidth / 2, 50, { align: 'center' });

  
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55); 
    doc.setLineWidth(0.1);

    const customerTable = [
        ["Vendor ID", customer.VendorRegisterID._id],
        ["Vendor Name", customer.VendorRegisterID.VendorName],
        ["Vendor Email", customer.VendorRegisterID.Email],
        ["Customer ID", customer.customerID],
        ["Name", customer.customerName],
        ["Email", customer.email],
        ["Phone", customer.contactNumber],
        ["Address", customer.address],
        ["City", customer.city],
        ["State", customer.state],
        ["Country", customer.country]
    ];

   
    doc.autoTable({
        startY: 60,
        head: [["Field", "Value"]],
        body: customerTable,
        theme: 'grid', 
        headStyles: { 
            fillColor: [0, 123, 255], 
            textColor: [255, 255, 255], 
            fontSize: 14, 
            fontStyle: 'bold',
            halign: 'center'  
        },
        bodyStyles: { 
            fontSize: 14, 
            halign: 'center', 
            valign: 'middle',
            textColor: [0, 0, 0] 
        },
        alternateRowStyles: { fillColor: [240, 240, 240] }, 
        margin: { top: 10, left: 20, right: 20 },
        styles: {
            cellPadding: 5, 
            overflow: 'linebreak',
        }
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("For any inquiries, please contact support Team ", pageWidth / 2, pageHeight - 30, { align: 'center' });

  
    doc.save(`Customer_Report_${customer.customerName}.pdf`);
};




  return (
    <Layout>
     <div className="p-4 sm:ml-64">
  <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
    <h2 className="text-center text-2xl font-semibold">Reports</h2>

    <div className="steps steps-vertical sm:flex sm:justify-center lg:steps-horizontal">
    <li
  className={`step ${selectedStep === "customer" ? "text-[#4996ff] font-semibold border-[#4996ff]" : ""}`}
  onClick={() => setSelectedStep("customer")}
>
  Customer
</li>
<li
  className={`step ${selectedStep === "vendor" ? "text-[#4996ff] font-semibold border-[#4996ff]" : ""}`}
  onClick={() => setSelectedStep("vendor")}
>
  Vendor
</li>
<li
  className={`step ${selectedStep === "product" ? "text-[#4996ff] font-semibold border-[#4996ff]" : ""}`}
  onClick={() => setSelectedStep("product")}
>
  Product
</li>
<li
  className={`step ${selectedStep === "bank" ? "text-[#4996ff] font-semibold border-[#4996ff]" : ""}`}
  onClick={() => setSelectedStep("bank")}
>
  Bank
</li>

    </div>

    <div className="mt-4">
      {selectedStep === "customer" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {customerData.length > 0 ? (
            customerData.map((customer) => (
              <div key={customer.customerID} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-medium">Customer: {customer.customerName}</h3>
                <button
                  onClick={() => generateCustomerPDF(customer)}
                  className="mt-2 p-2 custom-btn"
                >
                  Download Customer Report
                </button>
              </div>
            ))
          ) : (
            <p>No customer data available.</p>
          )}
        </div>
      )}

      {selectedStep === "vendor" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {vendorData.length > 0 ? (
            vendorData.map((vendor) => (
              <div key={vendor.VendorID} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-medium">Vendor: {vendor.VendorName}</h3>
                <button
                  onClick={() => generateVendorPDF(vendor)}
                  className="mt-2 p-2 custom-btn"
                >
                  Download Vendor Report
                </button>
              </div>
            ))
          ) : (
            <p>No vendor data available.</p>
          )}
        </div>
      )}

      {selectedStep === "product" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {productData.length > 0 ? (
            productData.map((product) => (
              <div key={product.productID} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-medium">Product: {product.productName}</h3>
                <button
                  onClick={() => generateProductPDF(product)}
                  className="mt-2 p-2 custom-btn"
                >
                  Download Product Report
                </button>
              </div>
            ))
          ) : (
            <p>No product data available.</p>
          )}
        </div>
      )}

      {selectedStep === "bank" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {bankData.length > 0 ? (
            bankData.map((bank) => (
              <div key={bank.VendorRegisterID} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-medium">Account Number: {bank.AccountNumber}</h3>

                <button
                  onClick={() => generateBankPDF(bank)}
                  className="mt-2 p-2 custom-btn"
                >
                  Download Bank Report
                </button>
              </div>
            ))
          ) : (
            <p>No bank data available.</p>
          )}
        </div>
      )}
    </div>
  </div>
</div>

    </Layout>
  );
};

export default Report;
