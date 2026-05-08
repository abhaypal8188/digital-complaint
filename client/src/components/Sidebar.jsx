import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  Settings,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Raise Complaint', path: '/dashboard/raise', icon: PlusCircle },
    { name: 'My Complaints', path: '/dashboard/my-complaints', icon: List },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Complaints', path: '/dashboard/manage-complaints', icon: List },
    { name: 'Manage Staff', path: '/dashboard/manage-staff', icon: Users },
  ];

  const links = user?.role === 'admin' || user?.role === 'staff' ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">DigiComplain</span>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/dashboard'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
