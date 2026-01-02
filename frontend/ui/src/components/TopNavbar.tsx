import React from 'react';
import { Dropdown, Button, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import i18n from '../i18n';
import './TopNavbar.css';

interface TopNavbarProps {
  onLogout: () => void;
  userRole?: string;
  userName?: string;
  appName: string;
  moduleName: string;
  bgColor?: string; // New prop for background color
  currentModuleDisplayName?: string; // New prop for the dropdown button text
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout, userRole, userName = 'Usuario', appName, moduleName, bgColor, currentModuleDisplayName }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar className="top-navbar" style={{ backgroundColor: bgColor }}>
      <div className="d-flex align-items-baseline">
        <span className="app-name-text">{appName}</span>
        {moduleName && <span className="module-name-text"> · {moduleName}</span>}
      </div>

      <Nav className="ms-auto user-info">
        <Dropdown className="me-3"> {/* Add a little margin to the right */}
          <Dropdown.Toggle variant="secondary" id="dropdown-module-select" size="sm">
            {currentModuleDisplayName || t('common.module')} {/* Use new prop for text */}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate('/pos')}>
              {t('moduleSelector.posSubtitle')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/invoice')}>
              {t('moduleSelector.invoiceSubtitle')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/select-module')}>
              {t('common.backToModules')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {userRole && <span className="user-role-text me-1">{userRole}</span>}
        
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" id="dropdown-profile" className="user-name-dropdown-toggle">
            {userName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.ItemText className="text-muted">{t('common.language')}</Dropdown.ItemText>
            <Dropdown.Item onClick={() => changeLanguage('es')} active={i18n.language === 'es'}>
              {t('common.spanish')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage('en')} active={i18n.language === 'en'}>
              {t('common.english')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>{t('common.logout')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;
