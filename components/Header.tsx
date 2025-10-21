import React from 'react';
import type { Language, View, User } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  setView: (view: View) => void;
  currentView: View;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const translations = {
  en: {
    title: 'RexSignal',
    dashboard: 'Dashboard',
    vip: 'VIP Signals',
    admin: 'Admin',
    welcome: 'Welcome',
    logout: 'Logout',
    settings: 'Settings',
  },
  km: {
    title: 'RexSignal',
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    vip: 'សញ្ញា VIP',
    admin: 'អ្នកគ្រប់គ្រង',
    welcome: 'សូមស្វាគមន៍',
    logout: 'ចាកចេញ',
    settings: 'ការកំណត់',
  },
};

const Header: React.FC<HeaderProps> = ({ language, setLanguage, setView, currentView, isAuthenticated, user, onLogout }) => {
  const t = translations[language];

  const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => setView(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-gold-600 text-white'
          : 'text-gray-300 hover:bg-dark-tertiary hover:text-white'
      }`}
    >
      {children}
    </button>
  );
  
  const isAdmin = user?.name.toLowerCase() === 'admin';

  return (
    <header className="bg-dark-secondary shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gold-400">📊 {t.title}</span>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink view="dashboard">{t.dashboard}</NavLink>
                <NavLink view="vip">{t.vip}</NavLink>
                {isAdmin && <NavLink view="admin">{t.admin}</NavLink>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <div className="hidden sm:block text-sm text-gray-300">
                {t.welcome}, <span className="font-bold text-gold-400">{user.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded-l-md ${
                  language === 'en' ? 'bg-gold-600 text-white' : 'bg-dark-tertiary text-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('km')}
                className={`px-3 py-1 text-sm rounded-r-md ${
                  language === 'km' ? 'bg-gold-600 text-white' : 'bg-dark-tertiary text-gray-300'
                }`}
              >
                KH
              </button>
            </div>
             {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('settings')}
                  className={`p-2 rounded-full text-sm font-medium transition-colors ${
                    currentView === 'settings'
                      ? 'bg-gold-600 text-white'
                      : 'text-gray-300 hover:bg-dark-tertiary hover:text-white'
                  }`}
                  title={t.settings}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={onLogout} 
                  className="p-2 rounded-full text-sm font-medium transition-colors text-gray-300 hover:bg-red-800/50 hover:text-white"
                  title={t.logout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;