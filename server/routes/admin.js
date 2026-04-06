const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
router.get('/employees', protect, admin, async (req, res) => {
  try {
    const employees = await Employee.find({}).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve/Reject employee
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
router.put('/approve/:id', protect, admin, async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);

    if (user) {
      user.isApproved = req.body.isApproved;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign task
// @route   POST /api/admin/tasks
// @access  Private/Admin
router.post('/tasks', protect, admin, async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    // assignedTo is expected to be an array of IDs
    const task = await Task.create({
      title,
      description,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [assignedTo],
    });

    if (task) {
      res.status(201).json(task);
    } else {
      res.status(400).json({ message: 'Invalid task data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
router.get('/tasks', protect, admin, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
