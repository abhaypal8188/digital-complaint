import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .post(protect, addComment)
  .get(protect, getComments);

export default router;
