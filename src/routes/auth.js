const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agency = require('../models/Agency');
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');

// Middleware to check if user is super admin
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Create super admin (should be used only once during initial setup)
router.post('/create-super-admin', async (req, res) => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'Super admin already exists' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create super admin user
    const superAdmin = new User({
      username,
      email,
      password,
      role: 'super_admin'
    });

    await superAdmin.save();

    res.status(201).json({
      message: 'Super admin created successfully',
      user: {
        id: superAdmin._id,
        username: superAdmin.username,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Super admin creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create super admin' });
  }
});

// Login route (updated to include role and permissions)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        permissions: user.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all agencies
router.get('/agencies', async (req, res) => {
  try {
    const agencies = await Agency.find({ status: 'active' });
    res.json(agencies);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({ error: 'Failed to fetch agencies' });
  }
});

// Add agency (protected by super admin middleware)
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, 'agency-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Update the add agency route to handle file uploads
// Import auth middleware at the top
const { auth } = require('../middleware/auth');

// Update the agency route to use both middlewares
router.post('/agencies', auth, isSuperAdmin, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    try {
      const { name, email, location } = req.body;
      const agency = new Agency({
        name,
        email,
        location,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      });
      
      await agency.save();
      res.status(201).json({
        message: 'Agency created successfully',
        agency
      });
    } catch (error) {
      console.error('Error creating agency:', error);
      res.status(500).json({ error: 'Failed to create agency' });
    }
  });
});
// Verify token and user role
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      verified: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get system statistics (protected by super admin middleware)
// Get dashboard statistics (protected by super admin middleware)
router.get('/statistics', isSuperAdmin, async (req, res) => {
  try {
    const [totalUsers, totalAgencies, totalComplaints] = await Promise.all([
      User.countDocuments(),
      Agency.countDocuments(),
      Complaint.countDocuments()
    ]);

    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    res.json({
      totalUsers,
      totalAgencies,
      totalComplaints,
      resolvedComplaints
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});
// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with that email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'citizen' // Default role for new registrations
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        permissions: user.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
module.exports = router;