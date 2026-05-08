import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.role === 'admin' || user.role === 'staff') {
          const { data } = await api.get('/complaints/stats/dashboard');
          setStats(data);
        } else {
          const { data } = await api.get('/complaints/my');
          const myStats = {
            total: data.length,
            pending: data.filter(c => c.status === 'Pending').length,
            inProgress: data.filter(c => c.status === 'In Progress').length,
            resolved: data.filter(c => c.status === 'Resolved').length,
          };
          setStats(myStats);
        }
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 w-1/4 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  const cards = [
    { title: 'Total Complaints', value: stats?.total || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'In Progress', value: stats?.inProgress || 0, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of the complaint system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {(user.role === 'admin' || user.role === 'staff') && stats?.categoryStats && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Complaints by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
