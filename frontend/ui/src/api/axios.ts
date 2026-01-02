import axios from 'axios';
import { toast } from 'react-toastify';
import i18n from '../i18n';

// Type definitions for the setters and navigate function
type SetConnectivityError = (isError: boolean) => void;
type SetForbiddenModal = (show: boolean) => void;
type SetAuthMessage = (message: string | null) => void;
type SetLastVisitedRoute = (route: string | null) => void;
type NavigateFunction = (path: string) => void;

let setGlobalConnectivityError: SetConnectivityError | null = null;
let setGlobalForbiddenModal: SetForbiddenModal | null = null;
let setGlobalAuthMessage: SetAuthMessage | null = null;
let setGlobalLastVisitedRoute: SetLastVisitedRoute | null = null;
let globalNavigate: NavigateFunction | null = null;
let currentPathname: string = '/'; // Initialize with a default value

export const setupAxiosInterceptors = (
  setConnectivityError: SetConnectivityError,
  setForbiddenModal: SetForbiddenModal,
  navigate: NavigateFunction,
  setAuthMessage: SetAuthMessage,
  setLastVisitedRoute: SetLastVisitedRoute,
  pathName: string
) => {
  setGlobalConnectivityError = setConnectivityError;
  setGlobalForbiddenModal = setForbiddenModal;
  globalNavigate = navigate;
  setGlobalAuthMessage = setAuthMessage;
  setGlobalLastVisitedRoute = setLastVisitedRoute;
  currentPathname = pathName;
};

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout for requests
});

instance.interceptors.request.use(
  (config) => {
    // Clear connectivity error state on new request if it was set
    if (setGlobalConnectivityError) {
      setGlobalConnectivityError(false);
    }
    // Clear any previous authentication message on a new request
    if (setGlobalAuthMessage) {
        setGlobalAuthMessage(null);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // If a request succeeds, clear any active connectivity error
    if (setGlobalConnectivityError) {
      setGlobalConnectivityError(false);
    }
    // Also clear any authentication messages
    if (setGlobalAuthMessage) {
        setGlobalAuthMessage(null);
    }
    return response;
  },
  (error) => {
    // Check for connectivity errors first
    // axios.isCancel() is used to check if the error is due to a request cancellation,
    // which shouldn't trigger connectivity errors.
    if (axios.isCancel(error)) {
        return Promise.reject(error);
    }

    if (!error.response) {
        // Network error (e.g., no internet, backend down, CORS issue before response)
        // Check error.code for common network errors like 'ERR_NETWORK' for Axios
        // or 'ECONNABORTED' for timeout, or check error.message for generic network failure messages
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
            if (setGlobalConnectivityError) {
                setGlobalConnectivityError(true);
            }
            if (setGlobalAuthMessage) { // Clear auth message if connectivity error occurs
                setGlobalAuthMessage(null);
            }
            // Do NOT log the user out, Do NOT redirect, Do NOT reload the page
            // Return a pending promise to halt further processing of this request
            return new Promise(() => {});
        }
    }

    let errorMessage: string;
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401: // Unauthorized
          localStorage.removeItem('token');
          // Store the current route before redirecting to login
          if (setGlobalLastVisitedRoute) {
              setGlobalLastVisitedRoute(currentPathname);
          }
          if (globalNavigate) {
            globalNavigate('/login');
          }
          // Set authentication message for display in LoginScreen or a global toast
          if (setGlobalAuthMessage) {
              setGlobalAuthMessage(i18n.t('errors.unauthorizedSessionExpired'));
          }
          toast.error(i18n.t('errors.unauthorizedSessionExpired')); // Keep toast for immediate feedback
          // Do NOT retry the request
          // Return a rejected promise to stop further processing
          return Promise.reject(error);
        case 403: // Forbidden
          if (setGlobalForbiddenModal) {
            setGlobalForbiddenModal(true);
          }
          if (setGlobalAuthMessage) {
              setGlobalAuthMessage(data?.message || i18n.t('errors.forbiddenAction'));
          }
          // Do NOT redirect, Do NOT retry automatically
          // Return a pending promise to halt further processing of this request
          return new Promise(() => {});
        case 400:
          errorMessage = data?.message || i18n.t('errors.badRequest');
          toast.error(errorMessage);
          break;
        case 404:
          errorMessage = data?.message || i18n.t('errors.notFound');
          toast.error(errorMessage);
          break;
        case 500: // Internal Server Error
        case 502: // Bad Gateway
        case 503: // Service Unavailable
        case 504: // Gateway Timeout
          errorMessage = i18n.t('errors.serverError');
          toast.error(errorMessage); // Non-blocking toast
          break;
        default:
          errorMessage = data?.message || i18n.t('errors.generic', { status });
          toast.error(errorMessage);
          break;
      }
    } else {
        // Fallback for errors not caught by the specific network check above, if any
        // This might catch errors that are not HTTP responses, but also not specific network errors
        errorMessage = error.message || i18n.t('errors.unexpected');
        toast.error(errorMessage);
    }
    // Clear auth message for non-auth related errors
    if (setGlobalAuthMessage && status !== 401 && status !== 403) {
        setGlobalAuthMessage(null);
    }
    return Promise.reject(error);
  }
);

export const checkConnectivity = async () => {
    try {
        // Ping a simple, unauthenticated endpoint
        await axios.get('http://localhost:8080/health', { timeout: 3000 }); // Health check endpoint
        return true;
    } catch (e) {
        return false;
    }
}

// All other exports remain the same
import { CashRegister, OpenRegisterRequest, CloseRegisterRequest, CloseCashRegisterResponse, CurrentCashRegisterResponse } from '../types/CashRegister';
import { InvoiceRequest, InvoiceResponse } from '../types/Invoice'; // Import new Invoice types

export const getCurrentCashRegister = async (): Promise<CurrentCashRegisterResponse> => {
    const response = await instance.get<CurrentCashRegisterResponse>('/cash-register/current');
    return response.data;
};

export const openCashRegister = async (request: OpenRegisterRequest): Promise<CashRegister> => {
    const response = await instance.post<CashRegister>('/cash-register/open', request);
    return response.data;
};

export const closeCashRegister = async (request: CloseRegisterRequest): Promise<CloseCashRegisterResponse> => {
    const response = await instance.post<CloseCashRegisterResponse>('/cash-register/close', request);
    return response.data;
};

export const generateInvoice = async (request: InvoiceRequest): Promise<InvoiceResponse> => {
  const response = await instance.post<InvoiceResponse>('/invoices/generate', request);
  return response.data;
};

export default instance;

import { InventoryMovement, StockAdjustmentRequest, InventoryHistoryResponse } from '../types/Inventory';
import { User } from '../types/User'; // Import User type

export const adjustStock = async (request: StockAdjustmentRequest): Promise<void> => {
    await instance.post('/inventory/adjust', request);
};

export const getInventoryHistory = async (productId: number): Promise<InventoryHistoryResponse[]> => {
    const response = await instance.get<InventoryHistoryResponse[]>(`/inventory/history?productId=${productId}`);
    return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await instance.get<User>('/users/me');
  return response.data;
};



