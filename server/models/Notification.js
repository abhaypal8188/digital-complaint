import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['complaint_status', 'complaint_assigned', 'new_comment', 'system'],
    default: 'system'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId // Can be Complaint ID
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
