
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/Product';
import { InventoryHistoryResponse } from '../types/Inventory'; // Changed import
import { getInventoryHistory } from '../api/axios';

interface InventoryHistoryModalProps {
  show: boolean;
  onHide: () => void;
  product: Product | null;
}

const InventoryHistoryModal: React.FC<InventoryHistoryModalProps> = ({ show, onHide, product }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<InventoryHistoryResponse[]>([]); // Changed type
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setLoading(true);
      getInventoryHistory(product.id)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [product]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('inventory.historyTitle')} - {product?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <p>{t('inventory.loadingHistory')}</p> : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('inventory.history.date')}</th>
                <th>{t('inventory.history.user')}</th>
                <th>{t('inventory.history.type')}</th>
                <th>{t('inventory.history.quantity')}</th>
                <th>{t('inventory.history.reason')}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((move, index) => ( // Using index as key, since DTO has no ID
                <tr key={`${move.date}-${move.movementType}-${index}`}>
                  <td>{move.date ? new Date(move.date).toLocaleString() : ''}</td>
                  <td>{move.user}</td>
                  <td>{t(`inventory.types.${move.movementType.toLowerCase()}` as any, move.movementType)}</td>
                  <td>{move.quantity}</td>
                  <td>{move.reason}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{t('buttons.close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryHistoryModal;
