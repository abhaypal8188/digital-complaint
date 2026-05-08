import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Loader2, UserPlus } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');
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
                          c.user.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Complaints</h1>
        <p className="text-slate-500 dark:text-slate-400">View and update all reported issues across the system.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or user..." 
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

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <th className="p-4 pl-6">Complaint</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></td>
                </tr>
              ) : filteredComplaints.map(complaint => (
                <tr key={complaint._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{complaint.title}</p>
                    <p className="text-xs text-slate-500">{complaint.location}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={complaint.user.profileImage} alt="" className="w-8 h-8 rounded-full" />
                      <span className="text-sm font-medium">{complaint.user.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300">
                      {complaint.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 pr-6">
                    <Link to={`/dashboard/complaint/${complaint._id}`} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg inline-flex transition-colors">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;
