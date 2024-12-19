const Admin = require("../models/adminhandlers.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signupAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

    
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        });

      
        await newAdmin.save();

      
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      
        console.error('Error during admin signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Invalid login: No admin found with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                id: admin._id,
                email: admin.email,
            },
        });
    } catch (err) {
        console.error('Error during admin login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAdmin = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const dbUser = await Admin.findById(user.id);

        if (!dbUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const userWithoutPassword = { ...dbUser._doc };
        delete userWithoutPassword.password;

        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error('Error fetching admin data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logoutAdmin = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Error during admin logout:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};