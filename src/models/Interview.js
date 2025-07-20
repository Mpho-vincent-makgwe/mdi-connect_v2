import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled', 'rescheduled'],
    default: 'scheduled'
  },
  interviewerName: {
    type: String,
    required: true
  },
  interviewerEmail: {
    type: String
  },
  location: {
    type: String
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);