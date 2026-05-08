import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints/my');
        setComplaints(data);
      } catch (error) {
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-xs font-medium flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium flex items-center gap-1 w-max"><AlertCircle className="w-3 h-3" /> In Progress</span>;
      case 'Resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      Low: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
      Medium: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
      High: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
      Urgent: 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority]}`}>{priority}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage your reported issues.</p>
        </div>
        <Link to="/dashboard/raise" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-max">
          Raise New
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No complaints found</h3>
          <p className="text-slate-500 mt-1">You haven't raised any complaints matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map(complaint => (
            <div key={complaint._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(complaint.status)}
                  {getPriorityBadge(complaint.priority)}
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white line-clamp-1">{complaint.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{complaint.description}</p>
                
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-auto">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{complaint.category}</span>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{complaint.location}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center mt-auto">
                <span className="text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                <Link to={`/dashboard/complaint/${complaint._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Details <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
