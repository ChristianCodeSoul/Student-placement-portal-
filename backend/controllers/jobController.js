import Job from '../models/Job.js';
import Applicant from '../models/Applicant.js';

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

export const applyJob = async (req, res) => {
  try {
    const existing = await Applicant.findOne({ userId: req.user._id, jobId: req.params.jobId });
    if (existing) return res.status(400).json({ message: 'You already applied to this job' });
    const applicant = await Applicant.create({ userId: req.user._id, jobId: req.params.jobId });
    res.status(201).json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply' });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const applicants = await Applicant.find({ userId: req.user._id }).populate('jobId');
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applied jobs' });
  }
};
