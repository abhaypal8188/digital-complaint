import Comment from '../models/Comment.js';
import Complaint from '../models/Complaint.js';

// @desc    Add comment to complaint
// @route   POST /api/complaints/:complaintId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const comment = await Comment.create({
      complaint: complaintId,
      user: req.user._id,
      text: req.body.text
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name profileImage role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a complaint
// @route   GET /api/complaints/:complaintId/comments
// @access  Private
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaint: req.params.complaintId })
      .populate('user', 'name profileImage role')
      .sort({ createdAt: 1 });
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
