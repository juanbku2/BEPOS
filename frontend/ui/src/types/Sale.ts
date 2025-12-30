import { Customer } from './Customer';
import { User } from './User';

export interface Sale {
  id: number;
  saleDate: string;
  totalAmount: number;
  paymentMethod: string;
  customer?: Customer;
  user?: User;
}
