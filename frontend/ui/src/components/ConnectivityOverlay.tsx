import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';
import './ConnectivityOverlay.css'; // Create this CSS file

const ConnectivityOverlay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="connectivity-overlay">
      <div className="connectivity-content">
        <h1>{t('connectivity.connectionLost')}</h1>
        <p>{t('connectivity.cannotConnect')}</p>
        <ul>
          <li>{t('connectivity.checkNetwork')}</li>
          <li>{t('connectivity.checkBackend')}</li>
        </ul>
        <Spinner animation="border" role="status" variant="light" className="mt-3" />
        <p className="mt-2">{t('connectivity.reconnecting')}</p>
      </div>
    </div>
  );
};

export default ConnectivityOverlay;
