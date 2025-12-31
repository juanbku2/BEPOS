import { useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
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
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [cashReceived, setCashReceived] = useState('');

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

  const handleCashInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashReceived(e.target.value);
  };

  const change = parseFloat(cashReceived) - total;

  const renderCashPaymentView = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>{t('checkout.cashReceived')}</Form.Label>
        <InputGroup>
          <InputGroup.Text>$</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="0.00"
            value={cashReceived}
            onChange={handleCashInput}
            autoFocus
          />
        </InputGroup>
      </Form.Group>

      {cashReceived && change >= 0 && (
        <div className="alert alert-info">
          <h5>{t('checkout.change')}: ${change.toFixed(2)}</h5>
        </div>
      )}

      <div className="d-grid gap-2">
        <Button 
          variant="success" 
          onClick={() => handleFinalizeSale('CASH')}
          disabled={!cashReceived || change < 0}
        >
          {t('checkout.confirm')}
        </Button>
        <Button variant="secondary" onClick={() => setIsCashPayment(false)}>
          {t('checkout.back')}
        </Button>
      </div>
    </>
  );

  const renderPaymentSelectionView = () => (
    <div className="d-grid gap-2">
      <Button variant="success" onClick={() => setIsCashPayment(true)}>{t('checkout.cash')}</Button>
      <Button variant="primary" onClick={() => handleFinalizeSale('CREDIT')}>{t('checkout.credit')}</Button>
      <Button variant="secondary" onClick={() => handleFinalizeSale('DEBIT')}>{t('checkout.debit')}</Button>
    </div>
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>{t('checkout.total')}: ${total.toFixed(2)}</Card.Title>
        {customer && <Card.Subtitle className="mb-2 text-muted">{t('dashboard.customer')}: {customer.fullName}</Card.Subtitle>}
        <hr />
        {isCashPayment ? renderCashPaymentView() : renderPaymentSelectionView()}
      </Card.Body>
    </Card>
  );
};

export default Checkout;
