import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ModuleSelector from './components/ModuleSelector';
import Dashboard, { PosView } from './components/Dashboard';
import InvoicePage from './components/InvoicePage';
import ReportsHub from './components/ReportsHub';
import CorteDeCaja from './components/reports/CorteDeCaja';
import VentasReports from './components/reports/VentasReports';
import InventarioReports from './components/reports/InventarioReports';
import CajaReports from './components/reports/CajaReports';
import ClientesReports from './components/reports/ClientesReports';
import AvanzadosReports from './components/reports/AvanzadosReports';
import ProductComponent from './components/Product';
import CustomerComponent from './components/Customer';
import SupplierComponent from './components/Supplier';
import UserComponent from './components/User';
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
  const { setConnectivityError, setForbiddenModal, setAuthMessage, setLastVisitedRoute } = useError();
  const location = useLocation();

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
  const { isConnectivityError, showForbiddenModal, authMessage, setAuthMessage, lastVisitedRoute, setLastVisitedRoute } = useError();

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

  useEffect(() => {
    if (token && lastVisitedRoute) {
      navigate(lastVisitedRoute);
      setLastVisitedRoute(null);
    } else if (!token && location.pathname !== '/login') {
      setLastVisitedRoute(null);
    }
  }, [token, lastVisitedRoute, navigate, location.pathname, setLastVisitedRoute]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setLastVisitedRoute(null);
    setAuthMessage(null);
    navigate('/login');
  };

  const getAppName = () => {
    if (location.pathname.startsWith('/pos') || location.pathname.startsWith('/reports')) {
      return `BM - ${t('moduleSelector.posSubtitle')}`;
    } else if (location.pathname.startsWith('/invoice')) {
      return `BM - ${t('moduleSelector.invoiceSubtitle')}`;
    }
    return 'BM POS';
  };

  const getModuleInfo = () => {
    if (location.pathname.startsWith('/pos') || location.pathname.startsWith('/reports')) {
      return {
        name: '',
        displayName: t('moduleSelector.posSubtitle'),
        bgColor: 'var(--bm-green)'
      };
    } else if (location.pathname.startsWith('/invoice')) {
      return {
        name: '',
        displayName: t('moduleSelector.invoiceSubtitle'),
        bgColor: 'var(--bm-blue)'
      };
    } else if (location.pathname === '/select-module') {
      return { name: t('moduleSelector.title'), displayName: '', bgColor: '' };
    }
    return { name: '', displayName: '', bgColor: '' };
  };

  const moduleInfo = getModuleInfo();
  const showMainLayout = token && (location.pathname.startsWith('/pos') || location.pathname.startsWith('/invoice') || location.pathname.startsWith('/reports'));

  return (
    <>
      <AxiosInterceptorSetup />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover={false} />
      {isConnectivityError && <ConnectivityOverlay />}
      {showForbiddenModal && <ForbiddenModal isOpen={showForbiddenModal} onClose={() => setForbiddenModal(false)} message={authMessage} />}

      {showMainLayout && (
        <TopNavbar
          onLogout={handleLogout}
          userRole={currentUser?.role}
          userName={currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser?.username}
          appName={getAppName()}
          moduleName={moduleInfo.name}
          bgColor={moduleInfo.bgColor}
          currentModuleDisplayName={moduleInfo.displayName}
        />
      )}

      {showMainLayout ? (
        <div className="app-layout">
          <Routes>
            <Route element={<Dashboard onLogout={handleLogout} theme={theme} setTheme={handleSetTheme} />}>
              <Route path="/pos" element={<PosView />} />
              <Route path="/pos/products" element={<ProductComponent />} />
              <Route path="/pos/customers" element={<CustomerComponent />} />
              <Route path="/pos/suppliers" element={<SupplierComponent />} />
              <Route path="/pos/users" element={<UserComponent />} />
              <Route path="/reports" element={<ReportsHub />} />
              <Route path="/reports/corte-caja" element={<CorteDeCaja />} />
              <Route path="/reports/ventas/*" element={<VentasReports />} />
              <Route path="/reports/inventario" element={<InventarioReports />} />
              <Route path="/reports/caja" element={<CajaReports />} />
              <Route path="/reports/clientes" element={<ClientesReports />} />
              <Route path="/reports/avanzados" element={<AvanzadosReports />} />
            </Route>
            
            <Route path="/invoice" element={<InvoicePage onLogout={handleLogout} />} />

          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/select-module" element={token ? <ModuleSelector /> : <Navigate to="/login" />} />
          <Route path="/" element={token ? <Navigate to="/select-module" /> : <Navigate to="/login" />} />
          <Route path="*" element={token ? <Navigate to="/select-module" /> : <Navigate to="/login" />} />
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
