import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ModuleSelector from './components/ModuleSelector';
import Dashboard from './components/Dashboard';
import InvoicePage from './components/InvoicePage';
import TopNavbar from './components/TopNavbar';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from './types/User';

import { ErrorProvider, useError } from './context/ErrorContext';
import { setupAxiosInterceptors } from './api/axios';
import ConnectivityOverlay from './components/ConnectivityOverlay';
import ForbiddenModal from './components/ForbiddenModal';

// Component to setup interceptors once
const AxiosInterceptorSetup = () => {
  const navigate = useNavigate();
  const { setConnectivityError, setForbiddenModal, setAuthMessage, setLastVisitedRoute } = useError(); // Destructure setLastVisitedRoute
  const location = useLocation(); // Use useLocation to get current path

  useEffect(() => {
    setupAxiosInterceptors(setConnectivityError, setForbiddenModal, navigate, setAuthMessage, setLastVisitedRoute, location.pathname);
  }, [setConnectivityError, setForbiddenModal, navigate, setAuthMessage, setLastVisitedRoute, location.pathname]);

  return null;
};

function AppContent() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'theme-fresh');
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnectivityError, showForbiddenModal, authMessage, setAuthMessage, lastVisitedRoute, setLastVisitedRoute } = useError(); // Get all error context states

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

  // Handle 401 redirect after login, check for last visited route
  useEffect(() => {
    if (token && lastVisitedRoute) {
      navigate(lastVisitedRoute);
      setLastVisitedRoute(null); // Clear stored route after navigation
    } else if (!token && location.pathname !== '/login') {
      // If token is lost and not on login page, clear any stored route
      // This prevents redirecting to a protected route after an explicit logout
      setLastVisitedRoute(null);
    }
  }, [token, lastVisitedRoute, navigate, location.pathname, setLastVisitedRoute]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setLastVisitedRoute(null); // Ensure no old route is kept
    setAuthMessage(null); // Clear any authentication message on logout
    navigate('/login');
  };

  const getAppName = () => {
    if (location.pathname.startsWith('/pos')) {
      return `BM - ${t('moduleSelector.posSubtitle')}`;
    } else if (location.pathname.startsWith('/invoice')) {
      return `BM - ${t('moduleSelector.invoiceSubtitle')}`;
    }
    return 'BM POS';
  };

  const getModuleName = () => {
    if (location.pathname.startsWith('/pos')) {
      return '';
    } else if (location.pathname.startsWith('/invoice')) {
      return '';
    } else if (location.pathname === '/select-module') {
      return t('moduleSelector.title');
    }
    return '';
  };

  return (
    <>
      <AxiosInterceptorSetup />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
      />

      {isConnectivityError && <ConnectivityOverlay />}
      {showForbiddenModal && <ForbiddenModal isOpen={showForbiddenModal} onClose={() => setForbiddenModal(false)} message={authMessage} />}

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

      {token && (location.pathname.startsWith('/pos') || location.pathname.startsWith('/invoice')) ? (
        <div className="app-layout">
          <Routes>
            <Route
              path="/pos"
              element={
                <Dashboard
                  onLogout={handleLogout}
                  theme={theme}
                  setTheme={handleSetTheme}
                />
              }
            />
            <Route
              path="/invoice"
              element={
                <InvoicePage
                  onLogout={handleLogout}
                />
              }
            />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/select-module" element={token ? <ModuleSelector /> : <Navigate to="/login" />} />
          <Route path="/" element={token ? <Navigate to="/select-module" /> : <Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
}

export default App;
