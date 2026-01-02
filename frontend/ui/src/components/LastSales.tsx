import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import instance from '../api/axios'; // Import the configured axios instance
import { Sale } from '../types/Sale';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './LastSales.css'; // Import custom CSS for the button

interface LastSalesProps {
  onInvoiceSale?: (sale: Sale) => void; // Optional prop to pass the sale to a parent handler
}

const LastSales = ({ onInvoiceSale }: LastSalesProps) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    instance.get('/sales?limit=10') // Use instance and remove /api/v1
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching last sales:', error);
      });
  }, []);

  const handleInvoiceClick = (sale: Sale) => {
    if (onInvoiceSale) {
      onInvoiceSale(sale);
    } else {
      console.log('Facturar sale ID:', sale.id);
      // Placeholder for opening invoice modal
    }
  };

  return (
    <div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('lastSales.idHeader')}</th> {/* Translate ID */}
            <th>{t('lastSales.customerHeader')}</th> {/* Translate Customer */}
            <th>{t('lastSales.userHeader')}</th> {/* Translate User */}
            <th>{t('lastSales.totalHeader')}</th> {/* Translate Total */}
            <th>{t('lastSales.dateHeader')}</th> {/* Translate Date */}
            <th></th> {/* New column for the button */}
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customer?.fullName}</td>
              <td>{sale.user?.username}</td>
              <td>${sale.totalAmount.toFixed(2)}</td>
              <td>{new Date(sale.saleDate).toLocaleString()}</td>
              <td>
                <Button
                  className="bm-invoice-button"
                  size="sm"
                  onClick={() => handleInvoiceClick(sale)}
                >
                  {t('common.invoice')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LastSales;
