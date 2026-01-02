
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/Product';
import { adjustStock } from '../api/axios';
import { StockAdjustmentRequest } from '../types/Inventory';

interface StockAdjustmentModalProps {
  show: boolean;
  onHide: () => void;
  product: Product | null;
  onAdjust: () => void;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ show, onHide, product, onAdjust }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [movementType, setMovementType] = useState<'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'LOSS'>('RESTOCK');
  const [reason, setReason] = useState('');

  const handleAdjust = async () => {
    if (!product || !quantity) return;

    const request: StockAdjustmentRequest = {
      productId: product.id,
      quantity: parseFloat(quantity),
      movementType,
      reason: (movementType === 'MANUAL_ADJUSTMENT' || movementType === 'LOSS') ? reason : undefined,
    };

    try {
      await adjustStock(request);
      onAdjust();
      onHide();
    } catch (error) {
      // Error is already handled by axios interceptor
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('inventory.adjustStockTitle')} - {product?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{t('inventory.quantity')}</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t('inventory.quantityPlaceholder')}
              autoFocus
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('inventory.movementType')}</Form.Label>
            <Form.Select value={movementType} onChange={(e) => setMovementType(e.target.value as any)}>
              <option value="RESTOCK">{t('inventory.types.restock')}</option>
              <option value="MANUAL_ADJUSTMENT">{t('inventory.types.manualAdjustment')}</option>
              <option value="LOSS">{t('inventory.types.loss')}</option>
            </Form.Select>
          </Form.Group>
          {(movementType === 'MANUAL_ADJUSTMENT' || movementType === 'LOSS') && (
            <Form.Group>
              <Form.Label>{t('inventory.reason')}</Form.Label>
              <Form.Control
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('inventory.reasonPlaceholder')}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{t('buttons.cancel')}</Button>
        <Button variant="primary" onClick={handleAdjust}>{t('inventory.adjustButton')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StockAdjustmentModal;
