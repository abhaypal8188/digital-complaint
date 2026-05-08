import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getDashboardStats
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 3), createComplaint)
  .get(protect, authorize('admin', 'staff'), getComplaints);

router.get('/my', protect, getMyComplaints);
router.get('/stats/dashboard', protect, authorize('admin', 'staff'), getDashboardStats);

router.route('/:id')
  .get(protect, getComplaintById);

router.put('/:id/status', protect, authorize('admin', 'staff'), updateComplaintStatus);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);

export default router;
