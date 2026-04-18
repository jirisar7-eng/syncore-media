/* ID-START: GUI_APP_001 */
import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { Dashboard } from './pages/Dashboard';
import { HubPage } from './pages/HubPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    switch (route) {
      case '#/': return <LandingPage />;
      case '#/login': return <LoginPage />;
      case '#/search': return <SearchPage />;
      case '#/dashboard': return <Dashboard />;
      case '#/hub': return <HubPage />;
      case '#/admin': return <AdminPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderRoute()}
    </div>
  );
}
/* ID-END: GUI_APP_001 */
// Force sync F-99-PROD
