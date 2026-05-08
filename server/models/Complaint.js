import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title for the complaint'],
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Plumbing', 'Electricity', 'Cleaning', 'Internet', 'Security', 'Food', 'Others']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: [true, 'Please specify the location or room number']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
