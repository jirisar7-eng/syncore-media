/* ID-START: GUI_APP_001 */
import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { Dashboard } from './pages/Dashboard';
import { HubPage } from './pages/HubPage';
import { DeployPage } from './pages/DeployPage';
import { SystemPage } from './pages/SystemPage';
import { Navbar } from './components/Navbar';
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
      case '#/': 
      case '#/hub': return <HubPage />;
      case '#/login': return <LoginPage />;
      case '#/search': return <SearchPage />;
      case '#/dashboard': return <Dashboard />;
      case '#/deploy': return <DeployPage />;
      case '#/system': return <SystemPage />;
      case '#/admin': return <AdminPage />;
      default: return <HubPage />;
    }
  };

  const showNavbar = !['#/login', '#/landing'].includes(route);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {showNavbar && <Navbar />}
      {renderRoute()}
    </div>
  );
}
/* ID-END: GUI_APP_001 */
// Force sync F-99-PROD
