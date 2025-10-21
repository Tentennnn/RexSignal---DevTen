import React, { useState } from 'react';
import Header from './components/Header';
import TradingViewWidget from './components/TradingViewWidget';
import SignalPanel from './components/SignalPanel';
import MarketSummary from './components/MarketSummary';
import Calculator from './components/Calculator';
import VipSection from './components/VipSection';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Settings from './components/Settings';
import type { Language, View, User } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setView('dashboard'); // Reset to default view on logout
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : null);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
            <div className="lg:col-span-2 xl:col-span-3">
              <TradingViewWidget />
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
              <SignalPanel language={language} user={user} />
              <MarketSummary language={language} />
              <Calculator language={language} />
            </div>
          </div>
        );
      case 'vip':
        return <VipSection language={language} />;
      case 'admin':
        return <AdminDashboard language={language} />;
      case 'settings':
        return user ? <Settings language={language} user={user} onUserUpdate={handleUserUpdate} /> : null;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${language === 'km' ? 'font-khmer' : 'font-sans'} bg-dark-primary text-gray-200`}>
        <Login 
          language={language}
          setLanguage={setLanguage}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${language === 'km' ? 'font-khmer' : 'font-sans'}`}>
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        setView={setView}
        currentView={view} 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;