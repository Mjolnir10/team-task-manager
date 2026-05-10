const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    });

    const projectIds = projects.map(p => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    if (project.admin.toString() !== req.user._id.toString() &&
        !project.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user._id
    });

    await task.save();
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    if (project.admin.toString() !== req.user._id.toString() &&
        !project.members.some(m => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'project' && key !== 'createdBy') {
        task[key] = updates[key];
      }
    });

    await task.save();
    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access - only admin or creator can delete
    if (project.admin.toString() !== req.user._id.toString() &&
        task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;