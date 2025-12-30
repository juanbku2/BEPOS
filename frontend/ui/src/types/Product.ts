import { Supplier } from './Supplier';

export interface Product {
  id: number;
  barcode: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  stockQuantity: number;
  minStockAlert: number;
  supplier: Supplier | null;
}
