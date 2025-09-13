// models/User.js
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
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: ["admin", "skilled", "unskilled"],
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

  // Sensitive fields, hidden by default (select: false)
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },

  invitedByAdmin: {
    type: Boolean,
    default: false
  },

  // Invitation token & temp password: hidden by default and unique for invitationToken
  invitationToken: {
    type: String,
    unique: true,
    sparse: true,
    select: false
  },
  invitationExpires: {
    type: Date,
    select: false
  },
  // Store hashed temporary password here (select: false)
  temporaryPassword: {
    type: String, // hashed
    select: false
  },
  isTemporaryPassword: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: false
  },
  invitationSent: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Always remove sensitive fields from any JSON response
      delete ret.password;
      delete ret.temporaryPassword;
      delete ret.invitationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      delete ret.invitationExpires;
      return ret;
    }
  }
});

// Virtual for application count
UserSchema.virtual('applicationCount').get(function() {
  return this.applications?.length || 0;
});

// Hash password automatically if it's modified and looks unhashed
UserSchema.pre('save', async function (next) {
  // If password changed and is not empty, hash it
  if (this.isModified('password') && this.password) {
    // Only hash if it doesn't already look like a bcrypt hash
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$') && !this.password.startsWith('$2y$')) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (err) {
        return next(err);
      }
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
