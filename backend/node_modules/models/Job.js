import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    deadline: { type: String, required: true },
    requirements: [{ type: String }],
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
