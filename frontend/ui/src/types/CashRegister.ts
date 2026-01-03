export type CashRegisterStatus = 'OPEN' | 'CLOSED';

export interface CashRegister {
  id: number;
  openingTime: string;
  closingTime?: string;
  openingBalance: number;
  closingBalance?: number;
  status: CashRegisterStatus;
}

export interface CurrentCashRegisterResponse {
  id: number;
  status: CashRegisterStatus;
  openingTime: string;
  openingBalance: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
}

export interface CloseCashRegisterResponse {
    id: number;
    openedAt: string;
    closedAt: string;
    openedBy: string;
    closedBy: string;
    initialCash: number;
    systemCash: number;
    countedCash: number;
    cashDifference: number;
    totalSales: number;
    totalCash: number;
    totalCard: number;
    totalCredit: number;
    status: CashRegisterStatus;
}


export interface OpenRegisterRequest {
  openingBalance: number;
}

export interface CloseRegisterRequest {
  closingBalance: number;
}
