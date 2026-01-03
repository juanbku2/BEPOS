import { CashRegisterStatus } from "./CashRegister";
import { MovementType } from "./Inventory"; // Assuming MovementType is in Inventory types

export interface CashRegisterClosureReportDTO {
    cashRegisterId: number;
    openedAt: string; // ISO date string
    closedAt?: string; // ISO date string
    openedBy: string;
    closedBy?: string;
    initialCash: number;
    systemCash?: number;
    countedCash?: number;
    cashDifference?: number;
    totalSales?: number;
    totalCash?: number;
    totalCard?: number;
    totalCredit?: number;
    status: string; // Was CashRegisterStatus
}

export interface SalesByDateReportDTO {
    saleDay: string; // ISO date string
    totalTickets: number;
    totalSales: number;
}

export interface SalesByProductReportDTO {
    id: number;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
}

export interface SalesByPaymentMethodReportDTO {
    paymentMethod: string;
    totalSales: number;
    totalAmount: number;
}

export interface CurrentInventoryStatusReportDTO {
    id: number;
    name: string;
    quantity: number;
    minStockAlert: number;
    lowStock: boolean;
}

export interface InventoryMovementReportDTO {
    createdAt: string; // ISO date string
    productName: string;
    movementType: string; // Was MovementType
    quantity: number;
    reason: string;
    createdBy: string;
}

export interface SalesByCashierReportDTO {
    username: string;
    totalSales: number;
    totalAmount: number;
}

export interface CashMovementReportDTO {
    createdAt: string; // ISO date string
    movementType: 'IN' | 'OUT';
    reason: string;
    amount: number;
    username: string;
}
