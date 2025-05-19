import React, { useState, useEffect, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutDuration = 5 * 60 * 1000; // 5 minutes

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // User activity tracking for auto-logout
  useEffect(() => {
    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  // Check for inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeoutDuration) {
        // Auto logout logic would go here
        // For now, we'll just show an alert
        alert('Your session is about to expire due to inactivity.');
        setLastActivity(Date.now()); // Reset to prevent multiple alerts
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [lastActivity]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
        <button 
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="mx-auto">
          <h1 className="text-xl font-bold text-primary-600">HCP ERP</h1>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
