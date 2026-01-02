import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import i18n from './i18n'; // Import your i18n configuration
import { I18nextProvider } from 'react-i18next';
import { CashRegisterProvider } from './context/CashRegisterContext.tsx';

// Set default language to Spanish as requested
i18n.changeLanguage('es');

createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <CashRegisterProvider>
        <App />
      </CashRegisterProvider>
    </BrowserRouter>
  </I18nextProvider>,
)
