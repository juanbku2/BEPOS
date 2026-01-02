import axios from 'axios';
import { toast } from 'react-toastify';
import i18n from '../i18n';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
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
  (response) => response,
  (error) => {
    let errorMessage;

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = data?.message || i18n.t('errors.badRequest');
          break;
        case 401:
          errorMessage = i18n.t('errors.unauthorized');
          break;
        case 403:
          errorMessage = i18n.t('errors.forbidden');
          break;
        case 404:
          errorMessage = data?.message || i18n.t('errors.notFound');
          break;
        case 500:
          errorMessage = i18n.t('errors.serverError');
          break;
        default:
          errorMessage = data?.message || i18n.t('errors.generic', { status });
          break;
      }
    } else if (error.request) {
      errorMessage = i18n.t('errors.networkError');
    } else {
      errorMessage = error.message || i18n.t('errors.unexpected');
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

import { CashRegister, OpenRegisterRequest, CloseRegisterRequest, CloseCashRegisterResponse, CurrentCashRegisterResponse } from '../types/CashRegister';

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

export default instance;

import { InventoryMovement, StockAdjustmentRequest, InventoryHistoryResponse } from '../types/Inventory';

export const adjustStock = async (request: StockAdjustmentRequest): Promise<void> => {
    await instance.post('/inventory/adjust', request);
};

export const getInventoryHistory = async (productId: number): Promise<InventoryHistoryResponse[]> => {
    const response = await instance.get<InventoryHistoryResponse[]>(`/inventory/history?productId=${productId}`);
    return response.data;
};

