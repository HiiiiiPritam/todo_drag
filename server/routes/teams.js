import express from 'express';
import {auth} from '../middleware/auth.js';
import {Team} from '../models/Team.js';

const router = express.Router();

// Get all teams
router.get('/',  async (req, res) => {
  const teams = await Team.find();
  const formattedTeams = teams.map((team) => ({ id: team._id, name: team.name, color: team.color, members: team.members, isGlobal: team.isGlobal }));
  res.json(formattedTeams);
});

// Create team
router.post('/',  async (req, res) => {
  const { name, color, memberIds } = req.body;
  const team = await Team.create({
    name,
    color,
    members: memberIds || [],
  });
  const formattedTeam={...team.toObject(),id:team._id}
  res.status(201).json(formattedTeam);
});

// Add user to team
router.post('/:teamId/add-member',  async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;
  const team = await Team.findByIdAndUpdate(teamId, {
    $addToSet: { members: userId }
  }, { new: true }).populate('members');
  const formattedTeam={...team.toObject(),id:team._id}
  res.json(formattedTeam);
});

// Get single team
router.get('/:teamId',  async (req, res) => {
  const team = await Team.findById(req.params.teamId).populate('members');
  const formattedTeam={...team.toObject(),id:team._id}
  res.json(formattedTeam);
});

router.delete('/:teamId',  async (req, res) => {
  await Team.findByIdAndDelete(req.params.teamId);
  res.json({ message: 'Team deleted' });
});


export default router;
