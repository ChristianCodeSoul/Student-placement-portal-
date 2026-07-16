import express from 'express';
import { getJobs, getJobById, applyJob, getAppliedJobs } from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/apply/:jobId', protect, applyJob);
router.get('/appliedJobs', protect, getAppliedJobs);

export default router;
