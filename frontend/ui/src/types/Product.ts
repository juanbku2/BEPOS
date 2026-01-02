import { Supplier } from './Supplier';

export interface Product {
  id: number;
  barcode: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  stock: number; // Changed from stockQuantity
  minStock: number; // Changed from minStockAlert
  lowStock: boolean; // New field
  unitOfMeasure?: 'KG' | 'LITER' | 'UNIT'; // Made optional
  supplier: Supplier | null;
}
