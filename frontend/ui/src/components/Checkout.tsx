import { Button, Card } from 'react-bootstrap';
import axios from '../api/axios';
import { Customer } from '../types/Customer';

interface CheckoutProps {
  items: { productId: number, quantity: number, price: number }[];
  customer: Customer | null;
  total: number;
  onSaleComplete: () => void;
}

const Checkout = ({ items, customer, total, onSaleComplete }: CheckoutProps) => {

  const handleFinalizeSale = (paymentMethod: string) => {
    const sale = {
      customerId: customer?.id,
      items: items,
      paymentMethod: paymentMethod
    };

    axios.post('/api/v1/sales', sale)
      .then(() => {
        onSaleComplete();
      })
      .catch(error => {
        console.error('Error finalizing sale:', error);
      });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Total: ${total.toFixed(2)}</Card.Title>
        {customer && <Card.Subtitle className="mb-2 text-muted">Customer: {customer.fullName}</Card.Subtitle>}
        <div className="d-grid gap-2">
          <Button variant="success" onClick={() => handleFinalizeSale('CASH')}>Cash</Button>
          <Button variant="primary" onClick={() => handleFinalizeSale('CREDIT')}>Credit</Button>
          <Button variant="secondary" onClick={() => handleFinalizeSale('DEBIT')}>Debit</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Checkout;
