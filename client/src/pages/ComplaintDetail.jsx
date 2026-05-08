import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Tag, User, Clock, CheckCircle, Send, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [compRes, commRes] = await Promise.all([
          api.get(`/complaints/${id}`),
          api.get(`/complaints/${id}/comments`)
        ]);
        setComplaint(compRes.data);
        setComments(commRes.data);
      } catch (error) {
        toast.error('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/complaints/${id}/comments`, { text: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    try {
      const { data } = await api.put(`/complaints/${id}/status`, { status });
      setComplaint(data);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!complaint) return <div>Complaint not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{complaint.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800' :
              complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' :
              'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800'
            }`}>
              {complaint.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2"><Tag className="w-4 h-4" /> {complaint.category}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {complaint.location}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(complaint.createdAt).toLocaleDateString()}</div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">{complaint.description}</p>
          </div>

          {complaint.images && complaint.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Attachments</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {complaint.images.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="shrink-0">
                    <img src={img} alt={`Attachment ${idx+1}`} className="w-40 h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Discussion</h2>
          
          <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
            {comments.map(comment => (
              <div key={comment._id} className="flex gap-4">
                <img src={comment.user.profileImage} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 rounded-tl-none border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{comment.user.name}</span>
                      <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-slate-500">No comments yet. Start the discussion!</p>}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="bg-blue-600 text-white rounded-xl px-5 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar Details */}
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Reported By</h3>
          <div className="flex items-center gap-4">
            <img src={complaint.user.profileImage} alt="" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{complaint.user.name}</p>
              <p className="text-sm text-slate-500">{complaint.user.email}</p>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Assigned To</h3>
          {complaint.assignedTo ? (
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center font-bold">
                 {complaint.assignedTo.name.charAt(0)}
               </div>
               <div>
                 <p className="font-semibold text-slate-900 dark:text-white">{complaint.assignedTo.name}</p>
                 <p className="text-sm text-slate-500">Staff Member</p>
               </div>
             </div>
          ) : (
            <p className="text-slate-500 italic text-sm">Not assigned yet</p>
          )}
        </div>

        {/* Admin Actions */}
        {(user.role === 'admin' || user.role === 'staff') && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Admin Actions</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium">Update Status</label>
              <select 
                value={complaint.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
