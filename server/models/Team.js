import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isGlobal: { type: Boolean, default: false }
}, { timestamps: true });

export const Team =  mongoose.model('Team', teamSchema);
