const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @desc    Get my tasks
// @route   GET /api/employee/tasks
// @access  Private/Employee
router.get('/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $in: [req.user._id] } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update task status
// @route   PUT /api/employee/tasks/:id
// @access  Private/Employee
router.put('/tasks/:id', protect, async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
