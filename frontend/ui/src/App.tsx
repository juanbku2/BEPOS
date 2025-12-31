import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import i18n from './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'theme-fresh');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
  }, [theme]);

  const handleSetTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem('app-theme', selectedTheme);
  };

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
      <div className="position-absolute top-0 end-0 p-2">
        <Dropdown>
          <Dropdown.Toggle variant="ghost" id="language-switcher">
            {t('common.language')}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => changeLanguage('es')}>{t('common.spanish')}</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage('en')}>{t('common.english')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
          token ? <Dashboard onLogout={handleLogout} theme={theme} setTheme={handleSetTheme} /> : <Navigate to="/login" />
        } />
      </Routes>
    </>
  );
}

export default App;
