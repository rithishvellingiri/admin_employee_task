const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check both collections for existing email
    const adminExists = await Admin.findOne({ email });
    const employeeExists = await Employee.findOne({ email });

    if (adminExists || employeeExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let user;
    let userRole = role || 'employee';

    if (userRole === 'admin') {
      user = await Admin.create({ name, email, password });
    } else {
      user = await Employee.create({ name, email, password });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        isApproved: userRole === 'admin' ? true : user.isApproved,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try finding in Admin collection
    let user = await Admin.findOne({ email });
    let role = 'admin';

    if (!user) {
      // Try finding in Employee collection
      user = await Employee.findOne({ email });
      role = 'employee';
    }

    if (user && (await user.comparePassword(password))) {
      // Check if employee is approved
      if (role === 'employee' && !user.isApproved) {
        return res.status(401).json({ message: 'Account pending admin approval' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        isApproved: role === 'admin' ? true : user.isApproved,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
