
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const adminRoutes = require('./routes/adminroutes');
const vendorRegistorRoutes = require('./routes/vendorregisterroutes');
const bankRoutes = require('./routes/bankroutes');
const customerRoutes = require('./routes/customerroute');
const productRoutes = require('./routes/productsroute');

dotenv.config(__dirname + '/.env');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,UPDATE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Project Vendor Management System...!');
});

// API Routes (use your route files if necessary)
// app.get('/api/admin/login', (req, res) => {
//   res.send('API is running...');
// });



// Serve static files from the React app
// if (process.env.NODE_ENV === 'production') {
//   //*Set static folder up in production
//   app.use(express.static('client/build'));

//   app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
// }


app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRegistorRoutes);
app.use('/api/vendor', bankRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);                          


app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
      console.log('Cannot start the server!', err);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;