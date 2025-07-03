import { Team } from '../models/Team.js';
import { User } from '../models/User.js';

const initGlobalTeam = async () => {
  const existing = await Team.findOne({ isGlobal: true });
  if (existing) return;

  const users = await User.find();
  await Team.create({
    name: 'Global Team',
    isGlobal: true,
    color: '#6b7280',
    members: users.map((u) => u._id),
  });

  console.log('✅ Global team initialized.');
};

export default initGlobalTeam;
