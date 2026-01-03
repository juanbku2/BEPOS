export type MovementType = 'INITIAL_STOCK' | 'SALE' | 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'LOSS' | 'RETURN';

export interface InventoryMovement {
    id: number;
    productName: string;
    userName: string;
    type: MovementType;
    quantity: number;
    reason?: string;
    date: string;
}

export interface StockAdjustmentRequest {
    productId: number;
    quantity: number;
    movementType: 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'LOSS';
    reason?: string;
}
