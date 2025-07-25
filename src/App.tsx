import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatAI from './components/ChatAI';
import Meetings from './components/Meetings';
import Documents from './components/Documents';
import Teams from './components/Teams';
import Settings from './components/Settings';
import AIModels from './components/AIModels';
import Analytics from './components/Analytics';
import Compliance from './components/Compliance';
import Templates from './components/Templates';
import LandingPage from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [credits, setCredits] = useState(15420);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn}
        credits={credits}
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'chat' && <ChatAI />}
          {activeTab === 'documents' && (
            <Documents />
          )}
          {activeTab === 'meetings' && (
            <Meetings />
          )}
          {activeTab === 'teams' && (
            <Teams />
          )}
          {activeTab === 'ai-models' && (
            <AIModels />
          )}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'compliance' && (
            <Compliance />
          )}
          {activeTab === 'templates' && (
            <Templates />
          )}
          {activeTab === 'settings' && (
            <Settings />
          )}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;