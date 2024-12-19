const upload = require('../middlewares/upload.js'); 
const VendorRegisterForm = require('../models/vendor.js');

exports.createVendor = [
  upload.single('imageUrl'),
  async (req, res) => {
    try {
      
      const {
        VendorRegisterID,
        VendorName,
        StatuaryStatus,
        VendorType,
        DateOfEstablishment,
        RegisteredOfficeAddress,
        FactoryAddress,
        GSTNumber,
        PANNumber,
        MSMERegistrationNumber,
        CINNumber,
        NearestLandmark,
        PhoneNumber,
        Email,
        Website,
        NatureofBusiness,
        TypeofBusiness,
        ProductDetails,
        TotalTurnoverPerAnnum,
        TotalEmployees,
      } = req.body;

   
      if (!VendorRegisterID || !VendorName || !PhoneNumber || !Email) {
        return res.status(400).json({
          error: "VendorRegisterID, VendorName, PhoneNumber, and Email are required.",
        });
      }

      const exists = await VendorRegisterForm.findOne({
        where: { VendorRegisterID, VendorName, PhoneNumber, GSTNumber, PANNumber },
      });
      if (exists) {
        return res.status(400).json({
          error: "Vendor data with these fields already exists.",
        });
      }

    
      const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

      
      const vendorData = {
        VendorRegisterID,
        VendorName,
        StatuaryStatus,
        VendorType,
        DateOfEstablishment,
        RegisteredOfficeAddress,
        FactoryAddress,
        GSTNumber,
        PANNumber,
        MSMERegistrationNumber,
        CINNumber,
        NearestLandmark,
        PhoneNumber,
        Email,
        Website,
        NatureofBusiness,
        TypeofBusiness,
        ProductDetails,
        TotalTurnoverPerAnnum,
        TotalEmployees,
        imageUrl,
      };

    
      const savedVendor = await VendorRegisterForm.create(vendorData);

     
      res.status(201).json({
        message: "Vendor registered successfully",
        vendor: savedVendor,
      });
    } catch (error) {
     
      console.error("Error during vendor creation:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds the limit of 5MB.' });
        }
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];





exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorRegisterForm.find();
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ error: 'No vendors found' });
    }
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getVendorById = async (req, res) => {
  try {
    const vendor = await VendorRegisterForm.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor by ID:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateVendor = [
  upload.single("imageUrl"), 
  async (req, res) => {
    try {
      const { id } = req.params;

   
      const updatedData = req.body;

     
      if (req.file) {
        updatedData.imageUrl = `uploads/${req.file.filename}`;
      }

   
      const vendor = await VendorRegisterForm.findByIdAndUpdate(id, updatedData, { new: true });

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      res.json(vendor);
    } catch (error) {
      console.error("Error updating vendor:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await VendorRegisterForm.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
