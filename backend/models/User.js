import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    status: { type: String, default: 'Student' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    university: { type: String, default: '' },
    course: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    yearStarted: { type: String, default: '' },
    yearGraduation: { type: String, default: '' },
    resume: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    secondaryEmail: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    skills: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
