export interface InventoryMovement {
    id: number;
    productName: string;
    userName: string;
    type: 'INITIAL' | 'RESTOCK' | 'SALE' | 'MANUAL_ADJUSTMENT' | 'LOSS' | 'RETURN';
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
