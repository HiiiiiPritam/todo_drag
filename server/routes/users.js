import express from 'express';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get all users (for adding to team)
router.get('/',  async (req, res) => {
  const users = await User.find({}, 'name email avatarUrl _id');
  const formattedUsers = users.map((user) => ({ id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }));
  
  res.json(formattedUsers);
});

export default router;
