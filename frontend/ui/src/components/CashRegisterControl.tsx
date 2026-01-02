
import React, { useState } from 'react';
import { useCashRegister } from '../context/CashRegisterContext';
import { useTranslation } from 'react-i18next';
import { CloseCashRegisterResponse } from '../../types/CashRegister';

// Basic Modal styles - will be improved later if needed
const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const modalContentStyles: React.CSSProperties = {
  background: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '400px',
};

export const CashRegisterControl: React.FC = () => {
  const { t } = useTranslation();
  const { status, openRegister, closeRegister, cashRegister, isLoading } = useCashRegister();
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [closureSummary, setClosureSummary] = useState<CloseCashRegisterResponse | null>(null);

  const handleOpenRegister = async () => {
    if (openingBalance) {
      await openRegister({ openingAmount: parseFloat(openingBalance) }); // Use openingAmount
      setIsOpening(false);
      setOpeningBalance('');
    }
  };

  const handleCloseRegister = async () => {
    if (closingBalance) {
      const summary = await closeRegister({ countedCash: parseFloat(closingBalance) }); // Use countedCash
      setClosureSummary(summary);
      setIsClosing(false);
      setClosingBalance('');
    }
  };

  if (isLoading) {
    return <button className="btn btn-secondary" disabled>{t('cashRegister.loading')}</button>;
  }

  return (
    <div>
      {status === 'OPEN' ? (
        <button className="btn btn-danger" onClick={() => setIsClosing(true)}>
          {t('cashRegister.close')}
        </button>
      ) : (
        <button className="btn btn-success" onClick={() => setIsOpening(true)}>
          {t('cashRegister.open')}
        </button>
      )}

      {isOpening && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h2>{t('cashRegister.openTitle')}</h2>
            <div className="mb-3">
              <label htmlFor="openingBalance" className="form-label">{t('cashRegister.openingBalance')}</label>
              <input
                type="number"
                className="form-control"
                id="openingBalance"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                autoFocus
              />
            </div>
            <button className="btn btn-primary" onClick={handleOpenRegister}>{t('cashRegister.open')}</button>
            <button className="btn btn-secondary ms-2" onClick={() => setIsOpening(false)}>{t('buttons.cancel')}</button>
          </div>
        </div>
      )}

      {isClosing && cashRegister && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h2>{t('cashRegister.closeTitle')}</h2>
            <p>{t('cashRegister.openingBalance')}: ${cashRegister.initialCash?.toFixed(2) || '0.00'}</p>
            {closureSummary && (
                <>
                    <p>{t('cashRegister.totalSales')}: ${closureSummary.totalSales?.toFixed(2) || '0.00'}</p>
                    <p>{t('cashRegister.totalCash')}: ${closureSummary.cash?.toFixed(2) || '0.00'}</p>
                    <p>{t('cashRegister.totalCard')}: ${closureSummary.card?.toFixed(2) || '0.00'}</p>
                </>
            )}
            <div className="mb-3">
              <label htmlFor="closingBalance" className="form-label">{t('cashRegister.closingBalance')}</label>
              <input
                type="number"
                className="form-control"
                id="closingBalance"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                autoFocus
              />
            </div>
            <button className="btn btn-primary" onClick={handleCloseRegister}>{t('cashRegister.close')}</button>
            <button className="btn btn-secondary ms-2" onClick={() => setIsClosing(false)}>{t('buttons.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
};
