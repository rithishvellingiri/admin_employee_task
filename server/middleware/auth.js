const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Try finding in Admin collection first
      let user = await Admin.findById(decoded.id).select('-password');
      if (user) {
        req.user = user.toObject();
        req.user.role = 'admin';
      } else {
        // Try finding in Employee collection
        user = await Employee.findById(decoded.id).select('-password');
        if (user) {
          req.user = user.toObject();
          req.user.role = 'employee';
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
