import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["skilled", "unskilled"], default: "unskilled" },
  experience: String,
  documents: [
    {
      filePath: String,
      fileType: String,
      fileName: String,
      fileUrl: String,
    }
  ],
  appliedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      coverLetter: String,
      resumeUrl: String,
      appliedAt: { type: Date, default: Date.now }, // Add application timestamp
    }
  ],
  yearsOfExperience: { type: String, default: "" },
  graduated: { type: String, default: "" },
  currentlyInTertiary: { type: String, default: "" },
  entryLevel: { type: String, default: "" },
  sector: { type: String, default: "" },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
