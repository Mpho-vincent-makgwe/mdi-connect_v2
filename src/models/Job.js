import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  linkedin: String,
  coverLetter: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected", "Accepted"],
    default: "Pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const JobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  sector: { 
    type: String, 
    enum: ["Mining", "Tourism", "Manufacturing"], 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  salary: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  requirements: { 
    type: [String], 
    required: true 
  },
  img: { 
    type: String, 
    required: true 
  },
  requiredApplicants: { 
    type: Number, 
    required: true 
  },
  applications: [ApplicationSchema],
  status: { 
    type: String, 
    enum: ["Open", "Closed"], 
    default: "Open" 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for application count
JobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Indexes
JobSchema.index({ title: 'text', description: 'text', company: 'text' });
JobSchema.index({ status: 1, deadline: 1 });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);