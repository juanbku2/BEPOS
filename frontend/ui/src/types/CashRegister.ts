export interface CashRegister {
  id: number;
  openingTime: string;
  closingTime?: string;
  openingBalance: number;
  closingBalance?: number;
  status: 'OPEN' | 'CLOSED';
}

export interface OpenRegisterRequest {
  openingBalance: number;
}

export interface CloseRegisterRequest {
  closingBalance: number;
}
