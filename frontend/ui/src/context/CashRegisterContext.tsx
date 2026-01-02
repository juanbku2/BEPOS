
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CashRegister, CurrentCashRegisterResponse, CloseCashRegisterResponse } from '../types/CashRegister';
import { getCurrentCashRegister, openCashRegister, closeCashRegister } from '../api/axios';
import { OpenRegisterRequest, CloseRegisterRequest } from '../types/CashRegister';

type CashRegisterStatus = 'OPEN' | 'CLOSED' | 'UNKNOWN';

interface CashRegisterContextType {
  cashRegister: CurrentCashRegisterResponse | null;
  status: CashRegisterStatus;
  isLoading: boolean;
  openRegister: (request: OpenRegisterRequest) => Promise<void>;
  closeRegister: (request: CloseRegisterRequest) => Promise<CloseCashRegisterResponse>; // Changed return type
  refresh: () => void;
}

const CashRegisterContext = createContext<CashRegisterContextType | undefined>(undefined);

export const CashRegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cashRegister, setCashRegister] = useState<CurrentCashRegisterResponse | null>(null);
  const [status, setStatus] = useState<CashRegisterStatus>('UNKNOWN');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const registerResponse = await getCurrentCashRegister();
      setCashRegister(registerResponse);
      setStatus(registerResponse.status);
    } catch (error) {
      console.error("Failed to fetch cash register status", error);
      setCashRegister({ status: 'CLOSED' } as CurrentCashRegisterResponse);
      setStatus('CLOSED');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const openRegister = async (request: OpenRegisterRequest) => {
    await openCashRegister(request);
    await fetchStatus();
  };

  const closeRegister = async (request: CloseRegisterRequest): Promise<CloseCashRegisterResponse> => { // Changed return type
    const response = await closeCashRegister(request);
    await fetchStatus(); // Refresh status after closing
    return response;
  };

  const refresh = () => {
    fetchStatus();
  }

  return (
    <CashRegisterContext.Provider value={{ cashRegister, status, isLoading, openRegister, closeRegister, refresh }}>
      {children}
    </CashRegisterContext.Provider>
  );
};

export const useCashRegister = () => {
  const context = useContext(CashRegisterContext);
  if (context === undefined) {
    throw new Error('useCashRegister must be used within a CashRegisterProvider');
  }
  return context;
};
