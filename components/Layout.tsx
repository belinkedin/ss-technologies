
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  MapPin, 
  Receipt, 
  BarChart3, 
  User as UserIcon, 
  Users as UsersIcon,
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const translations = {
  EN: {
    home: 'Home',
    locations: 'Locations',
    bills: 'Bills',
    reports: 'Reports',
    users: 'Users',
    profile: 'Profile',
    logout: 'Logout'
  },
  TA: {
    home: 'முகப்பு',
    locations: 'இடங்கள்',
    bills: 'பில்கள்',
    reports: 'அறிக்கைகள்',
    users: 'பயனர்கள்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு'
  }
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout, language } = useApp();

  const t = translations[language];

  const navItems = [
    { name: t.home, path: '/', icon: HomeIcon, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { name: t.locations, path: '/location', icon: MapPin, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { name: t.bills, path: '/bills', icon: Receipt, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
    { name: t.users, path: '/users', icon: UsersIcon, roles: [UserRole.OWNER] },
    { name: t.reports, path: '/reports', icon: BarChart3, roles: [UserRole.OWNER] },
    { name: t.profile, path: '/profile', icon: UserIcon, roles: [UserRole.OWNER, UserRole.EMPLOYEE] },
  ];

  const visibleNavItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">SS Technologies</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 font-medium hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            {t.logout}
          </button>
        </div>
      </aside>

      <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">SS Technologies</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </header>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm md:hidden">
          <div className="w-72 bg-white h-full flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl tracking-tight">SS Technologies</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl font-semibold text-lg ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    <Icon size={24} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <button 
              onClick={logout}
              className="mt-auto flex items-center gap-4 px-4 py-4 w-full rounded-xl text-red-600 font-semibold text-lg"
            >
              <LogOut size={24} />
              {t.logout}
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-20 md:pb-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
