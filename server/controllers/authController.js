import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'your-secret';

const createToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, ...rest } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required for avatar." });
    }
    // Set avatarUrl to first capital letter of name
    const avatarUrl = name.trim().charAt(0).toUpperCase();

    const user = await User.create({
      name,
      avatarUrl,
      ...rest,
    });

    const formattedUser = { id: user._id, ...user.toObject() };
    const token = createToken(formattedUser);

    res.status(201).json({ user: formattedUser, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const formattedUser={ id:user._id,...user.toObject() }
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = createToken(formattedUser);
  console.log(token, formattedUser);
  
  res.json({ user:formattedUser, token });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  const formattedUser={ id:user._id,...user.toObject() }
  res.json(formattedUser);
};
