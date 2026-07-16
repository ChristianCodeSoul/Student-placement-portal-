import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, default: 'Applied' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Applicant', applicantSchema);
