import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import instance, { generateInvoice } from '../api/axios'; // Import the configured axios instance and the new generateInvoice function
import { Sale } from '../types/Sale';
import { InvoiceRequest } from '../types/Invoice'; // Import InvoiceRequest from types

interface InvoiceModalProps {
  show: boolean;
  onHide: () => void;
  sale: Sale | null;
  onInvoiceSuccess: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ show, onHide, sale, onInvoiceSuccess }) => {
  const { t } = useTranslation();
  const [rfc, setRfc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [usoCfdi, setUsoCfdi] = useState(''); // This might be a dropdown in a real app
  const [codigoPostal, setCodigoPostal] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form fields when modal is shown or a new sale is selected
  useEffect(() => {
    if (show) {
      setRfc('');
      setRazonSocial('');
      setUsoCfdi('');
      setCodigoPostal('');
      setEmail('');
      setError('');
    }
  }, [show, sale]);

  const handleGenerateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sale) return;

    setLoading(true);
    setError('');

    const invoiceRequest: InvoiceRequest = {
      saleId: sale.id,
      rfc,
      razonSocial,
      usoCfdi,
      codigoPostal,
      email: email || undefined, // Send as undefined if empty
    };

    try {
      await generateInvoice(invoiceRequest); // Use the new generateInvoice API function
      toast.success(t('invoice.generatedSuccessfully'));
      onInvoiceSuccess(); // Notify parent component (Dashboard)
      onHide(); // Close modal
    } catch (err) {
      // Error handling is largely done by the axios interceptor (toast.error)
      // Here we just set a generic message if needed
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('invoice.generateError'));
      }
      console.error('Error generating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('invoice.generateInvoice')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {sale && (
          <p className="text-muted">
            {t('invoice.forSale')}: <strong>#{sale.id}</strong> - ${sale.totalAmount.toFixed(2)}
          </p>
        )}
        <Form onSubmit={handleGenerateInvoice}>
          <Form.Group className="mb-3" controlId="formRfc">
            <Form.Label>{t('invoice.rfc')}</Form.Label>
            <Form.Control
              type="text"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRazonSocial">
            <Form.Label>{t('invoice.razonSocial')}</Form.Label>
            <Form.Control
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsoCfdi">
            <Form.Label>{t('invoice.usoCfdi')}</Form.Label>
            <Form.Control
              type="text" // Could be a select/dropdown for predefined values
              value={usoCfdi}
              onChange={(e) => setUsoCfdi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCodigoPostal">
            <Form.Label>{t('invoice.codigoPostal')}</Form.Label>
            <Form.Control
              type="text"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Label>{t('invoice.email')} ({t('common.optional')})</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100"
            disabled={loading || !sale}
            style={{ backgroundColor: 'var(--bm-green)', borderColor: 'var(--bm-green)' }}
          >
            {loading ? t('common.generating') : t('invoice.generateButton')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceModal;
