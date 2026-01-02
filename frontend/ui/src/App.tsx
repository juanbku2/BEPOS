import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ModuleSelector from './components/ModuleSelector';
import Dashboard from './components/Dashboard';
import InvoicePage from './components/InvoicePage';
import TopNavbar from './components/TopNavbar'; // Import TopNavbar
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from './types/User';

function App() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'theme-fresh');
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path

  const handleSetTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem('app-theme', selectedTheme);
  };

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);

    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      const storedUser = localStorage.getItem('user');
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    navigate('/login');
  };

  const getAppName = () => {
    if (location.pathname.startsWith('/pos')) {
      return `BM - ${t('moduleSelector.posSubtitle')}`;
    } else if (location.pathname.startsWith('/invoice')) {
      return `BM - ${t('moduleSelector.invoiceSubtitle')}`; // Use invoiceSubtitle for a more concise name
    }
    return 'BM POS'; // Default or when not in a specific module
  };

  // Determine module name dynamically for TopNavbar
  const getModuleName = () => {
    if (location.pathname.startsWith('/pos')) {
      return ''; // No additional module name for POS
    } else if (location.pathname.startsWith('/invoice')) {
      return ''; // No additional module name for Invoice
    } else if (location.pathname === '/select-module') {
      return t('moduleSelector.title');
    }
    return ''; // Default
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
      />

      {/* Render TopNavbar only when authenticated and not on login/select-module screen */}
      {token && (location.pathname.startsWith('/pos') || location.pathname.startsWith('/invoice')) && (
        <TopNavbar
          onLogout={handleLogout}
          userRole={currentUser?.role}
          userName={currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser?.username}
          appName={getAppName()}
          moduleName={getModuleName()}
          bgColor={location.pathname.startsWith('/pos') ? 'var(--bm-green)' : 'var(--bm-blue)'}
          currentModuleDisplayName={location.pathname.startsWith('/pos') ? t('moduleSelector.posSubtitle') : (location.pathname.startsWith('/invoice') ? t('moduleSelector.invoiceSubtitle') : '')}
        />
      )}

      {/* Conditional rendering of app-layout for authenticated module views */}
      {token && (location.pathname.startsWith('/pos') || location.pathname.startsWith('/invoice')) ? (
        <div className="app-layout"> {/* New wrapper for sidebar and content */}
          <Routes>
            <Route
              path="/pos"
              element={
                <Dashboard
                  onLogout={handleLogout}
                  theme={theme}
                  setTheme={handleSetTheme}
                  // userRole and userName are now passed to TopNavbar directly from App
                />
              }
            />
            <Route
              path="/invoice"
              element={
                <InvoicePage
                  onLogout={handleLogout}
                  // userRole and userName are now passed to TopNavbar directly from App
                />
              }
            />
          </Routes>
        </div>
      ) : (
        <Routes>
          {/* Routes for Login and Module Selection outside the app-layout */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/select-module" element={token ? <ModuleSelector /> : <Navigate to="/login" />} />
          <Route path="/" element={token ? <Navigate to="/select-module" /> : <Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
