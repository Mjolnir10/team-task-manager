const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Search users by email (for inviting members)
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const users = await User.find({
      email: { $regex: q, $options: 'i' }
    })
    .select('name email role')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user to project by user ID
router.post('/add-to-project', auth, async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const Project = require('../models/Project');

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the project admin
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project admin can add members' });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    const updatedProject = await Project.findById(projectId)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;