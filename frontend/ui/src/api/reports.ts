import instance from './axios';
import { 
    CashRegisterClosureReportDTO,
    SalesByDateReportDTO,
    SalesByProductReportDTO,
    SalesByPaymentMethodReportDTO,
    CurrentInventoryStatusReportDTO,
    InventoryMovementReportDTO,
    SalesByCashierReportDTO,
    CashMovementReportDTO 
} from '../types/reports';

export const getCashRegisterClosureReport = async (id: number): Promise<CashRegisterClosureReportDTO> => {
    const response = await instance.get(`/reports/cash-register-closure/${id}`);
    return response.data;
};

export const getSalesByDateReport = async (startDate: string, endDate: string): Promise<SalesByDateReportDTO[]> => {
    const response = await instance.get('/reports/sales-by-date', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const getSalesByProductReport = async (startDate: string, endDate: string): Promise<SalesByProductReportDTO[]> => {
    const response = await instance.get('/reports/sales-by-product', {
        params: { startDate, endDate }
    });
    return response.data;
};

// TODO: Implement other report functions
export const getSalesByCashierReport = async (startDate: string, endDate: string): Promise<SalesByCashierReportDTO[]> => {
    const response = await instance.get('/reports/sales-by-cashier', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const getSalesByPaymentMethodReport = async (startDate: string, endDate: string): Promise<SalesByPaymentMethodReportDTO[]> => {
    const response = await instance.get('/reports/sales-by-payment-method', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const getInventoryMovementReport = async (startDate: string, endDate: string): Promise<InventoryMovementReportDTO[]> => {
    const response = await instance.get('/reports/inventory-movements', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const getCurrentInventoryStatusReport = async (): Promise<CurrentInventoryStatusReportDTO[]> => {
    const response = await instance.get('/reports/inventory-status');
    return response.data;
};

export const getCashMovementReport = async (cashRegisterId: number): Promise<CashMovementReportDTO[]> => {
    const response = await instance.get(`/reports/cash-movements/${cashRegisterId}`);
    return response.data;
};