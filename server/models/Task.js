import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'medium', 'low'],
    default: 'medium',
  },
  startDate: Date,
  endDate: Date,
  assignee: {
    id: { type: String },
    name: String,
    type: { type: String, enum: ['user', 'team'] },
    avatarUrl: String,
  },
  assignedBy: {
    id: { type: String },
    name: String,
    type: { type: String, enum: ['user', 'team'] },
    avatarUrl: String,
  },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
