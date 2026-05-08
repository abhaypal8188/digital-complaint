import { Link } from 'react-router-dom';
import { Shield, Clock, Bell, Settings, MessageSquare, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              DigiComplain
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 lg:py-32">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
              Resolve Issues <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Faster</span> Than Ever.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The modern complaint management system for communities, hostels, and offices. Track, manage, and resolve complaints with complete transparency and real-time updates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-600/30">
                Start for Free
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                Access Dashboard
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to manage complaints</h2>
              <p className="text-slate-600 dark:text-slate-400">Powerful features designed for modern communities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Clock, title: 'Real-time Tracking', desc: 'Monitor the status of your complaints in real-time from submission to resolution.' },
                { icon: Bell, title: 'Instant Notifications', desc: 'Get notified instantly via email and in-app alerts when status changes.' },
                { icon: Activity, title: 'Analytics Dashboard', desc: 'Comprehensive charts and reports for admins to track performance.' },
                { icon: Settings, title: 'Smart Assignment', desc: 'Automatically or manually route issues to the right staff member.' },
                { icon: MessageSquare, title: 'Direct Communication', desc: 'Chat directly on the complaint thread for clarifications.' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and accessible only to authorized personnel.' },
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} DigiComplain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
