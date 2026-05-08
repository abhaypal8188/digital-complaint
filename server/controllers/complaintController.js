import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }

    const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      category,
      priority,
      location,
      images: imageUrls
    });

    const createdComplaint = await complaint.save();

    // Notify admins (optional: find admins and create notification)
    
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user complaints
// @route   GET /api/complaints/my
// @access  Private
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (admin/staff)
// @route   GET /api/complaints
// @access  Private/Admin/Staff
export const getComplaints = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email profileImage')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email profileImage department')
      .populate('assignedTo', 'name email');

    if (complaint) {
      // Check if user is owner or admin/staff
      if (complaint.user._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin/Staff
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status || complaint.status;
      if (resolutionNotes !== undefined) {
        complaint.resolutionNotes = resolutionNotes;
      }

      const updatedComplaint = await complaint.save();

      // Create Notification for user
      const io = req.app.get('io');
      await Notification.create({
        user: complaint.user,
        message: `Your complaint "${complaint.title}" status changed to ${status}`,
        type: 'complaint_status',
        relatedId: complaint._id
      });
      
      if (io) {
        io.emit('notification', { user: complaint.user });
      }

      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign complaint
// @route   PUT /api/complaints/:id/assign
// @access  Private/Admin
export const assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.assignedTo = staffId;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/complaints/stats/dashboard
// @access  Private/Admin/Staff
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    // Group by category
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
