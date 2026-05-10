const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all projects for current user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    }).populate('admin', 'name email').populate('members', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    if (project.admin._id.toString() !== req.user._id.toString() &&
        !project.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id]
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin can add members
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    const updatedProject = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project tasks
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;