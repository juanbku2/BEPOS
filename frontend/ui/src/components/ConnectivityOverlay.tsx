import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';
import './ConnectivityOverlay.css';
import { useError } from '../context/ErrorContext'; // Import useError

const ConnectivityOverlay: React.FC = () => {
  const { t } = useTranslation();
  const { isConnectivityError } = useError(); // Get isConnectivityError from context

  if (!isConnectivityError) { // Render only if there's a connectivity error
    return null;
  }

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
