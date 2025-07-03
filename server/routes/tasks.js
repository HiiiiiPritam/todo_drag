import express from 'express';
import {auth} from '../middleware/auth.js';
import {Task} from '../models/Task.js';

const router = express.Router();

// Get all tasks (optional filter by team)
router.get('/', async (req, res) => {
  const { teamId } = req.query;
  const filter = teamId ? { teamId } : {};
  const tasks = await Task.find(filter);
  const formattedTasks = tasks.map((task) => ({ id: task._id, ...task.toObject() }));
  res.json(formattedTasks);
});

// Create task
router.post('/', async (req, res) => {
  const task = await Task.create(req.body);
  const formattedTasks={...task.toObject(),id:task._id}
  res.status(201).json(formattedTasks);
});

// Update task
router.patch('/:taskId', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
  const formattedTasks={...task.toObject(),id:task._id}

  res.json(formattedTasks);
});

router.delete('/:taskId', async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: 'Task deleted' });
});


export default router;
