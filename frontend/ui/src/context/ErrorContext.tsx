import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
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
  const connectivityCheckIntervalRef = useRef<number | null>(null);

  // Memoized version of setIsConnectivityError to be stable across renders
  const stableSetConnectivityError = useCallback((isError: boolean) => {
    setIsConnectivityError(isError);
  }, []);

  useEffect(() => {
    // Initial check when the component mounts
    const performInitialCheck = async () => {
      const isConnected = await checkConnectivity(); // This will also update setGlobalConnectivityError
      setIsConnectivityError(!isConnected);
    };
    performInitialCheck();

    // Set up continuous polling
    connectivityCheckIntervalRef.current = window.setInterval(async () => {
      await checkConnectivity(); // This function now handles updating the global connectivity error state directly
    }, 5000); // Poll every 5 seconds

    return () => {
      if (connectivityCheckIntervalRef.current !== null) {
        window.clearInterval(connectivityCheckIntervalRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <ErrorContext.Provider
      value={{
        isConnectivityError,
        setConnectivityError: stableSetConnectivityError, // Use the memoized setter
        showForbiddenModal,
        setForbiddenModal: setShowForbiddenModal,
        authMessage,
        setAuthMessage,
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