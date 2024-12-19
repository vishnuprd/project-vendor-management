
const express = require('express');
const router = express.Router(); 
const { loginAdmin, signupAdmin, getAdmin, logoutAdmin } = require('../controllers/adminhandlers.js'); 
const { verifyToken } = require('../utils/verifytoken.js'); 


router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.get('/verify', verifyToken, getAdmin); 
router.post('/logout', logoutAdmin); 

module.exports = router;