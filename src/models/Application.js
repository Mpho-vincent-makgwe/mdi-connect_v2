import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'interview', 'offered', 'rejected'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  resume: {
    type: String
  },
  coverLetter: {
    type: String
  }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);