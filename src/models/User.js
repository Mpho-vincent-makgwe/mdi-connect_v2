import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserJobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
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

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    unique: true,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ["skilled", "unskilled"], 
    default: "unskilled" 
  },
  completedQuestionnaire: {
    type: Boolean,
    default: false
  },
  sector: {
    type: String,
    enum: ['mining', 'tourism', 'manufacturing']
  },
  experience: {
    type: String,
    enum: ['yes', 'no']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative']
  },
  qualifications: {
    type: String,
    enum: ['yes', 'no']
  },
  educationLevel: {
    type: String,
    enum: ['high-school', 'diploma', 'bachelors', 'masters', 'phd', 'other']
  },
  currentlyStudying: {
    type: String,
    enum: ['yes', 'no']
  },
  applications: [UserJobApplicationSchema],
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Virtual for application count
UserSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);