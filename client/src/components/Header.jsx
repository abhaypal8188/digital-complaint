import { Bell, Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Header = ({ setIsOpen }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search Bar - hidden on mobile */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-5 h-5 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full w-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <img
            src={user?.profileImage || 'https://ui-avatars.com/api/?name=' + user?.name}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-blue-100 dark:border-blue-900 object-cover"
          />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
