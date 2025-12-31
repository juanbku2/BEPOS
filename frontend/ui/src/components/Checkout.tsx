import { Button, Card } from 'react-bootstrap';
import axios from '../api/axios';
import { Customer } from '../types/Customer';
import { useTranslation } from 'react-i18next';

interface CheckoutProps {
  items: { productId: number, quantity: number, price: number }[];
  customer: Customer | null;
  total: number;
  onSaleComplete: () => void;
}

const Checkout = ({ items, customer, total, onSaleComplete }: CheckoutProps) => {
  const { t } = useTranslation();

  const handleFinalizeSale = (paymentMethod: string) => {
    const sale = {
      customerId: customer?.id,
      userId: 1, // This should be dynamically set based on the logged-in user
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
        <Card.Title>{t('checkout.total')}: ${total.toFixed(2)}</Card.Title>
        {customer && <Card.Subtitle className="mb-2 text-muted">{t('dashboard.customer')}: {customer.fullName}</Card.Subtitle>}
        <div className="d-grid gap-2">
          <Button variant="success" onClick={() => handleFinalizeSale('CASH')}>{t('checkout.cash')}</Button>
          <Button variant="primary" onClick={() => handleFinalizeSale('CREDIT')}>{t('checkout.credit')}</Button>
          <Button variant="secondary" onClick={() => handleFinalizeSale('DEBIT')}>{t('checkout.debit')}</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Checkout;