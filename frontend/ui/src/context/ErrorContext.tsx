import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { checkConnectivity } from '../api/axios';

interface ErrorContextType {
  isConnectivityError: boolean;
  setConnectivityError: (isError: boolean) => void;
  showForbiddenModal: boolean;
  setForbiddenModal: (show: boolean) => void;
  authMessage: string | null;
  setAuthMessage: (message: string | null) => void;
  lastVisitedRoute: string | null;
  setLastVisitedRoute: (route: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [isConnectivityError, setIsConnectivityError] = useState(false);
  const [showForbiddenModal, setShowForbiddenModal] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [lastVisitedRoute, setLastVisitedRoute] = useState<string | null>(null);
  const connectivityCheckInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isConnectivityError) {
      connectivityCheckInterval.current = window.setInterval(async () => {
        const isConnected = await checkConnectivity();
        if (isConnected) {
          console.log('Connectivity re-established.');
          setIsConnectivityError(false);
          if (connectivityCheckInterval.current !== null) {
            window.clearInterval(connectivityCheckInterval.current);
            connectivityCheckInterval.current = null;
          }
        } else {
          console.log('Still no connectivity...');
        }
      }, 5000);
    } else {
      if (connectivityCheckInterval.current !== null) {
        window.clearInterval(connectivityCheckInterval.current);
        connectivityCheckInterval.current = null;
      }
    }

    return () => {
      if (connectivityCheckInterval.current !== null) {
        window.clearInterval(connectivityCheckInterval.current);
      }
    };
  }, [isConnectivityError]);

  return (
    <ErrorContext.Provider
      value={{
        isConnectivityError,
        setConnectivityError: setIsConnectivityError, // Direct reference
        showForbiddenModal,
        setForbiddenModal: setShowForbiddenModal,     // Direct reference
        authMessage,
        setAuthMessage,                               // Direct reference (no conflict now)
        lastVisitedRoute,
        setLastVisitedRoute,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};