import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from '../api/axios';
import { Sale } from '../types/Sale';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LastSales = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    axios.get('/api/v1/sales?limit=10')
      .then(response => {
        setSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching last sales:', error);
      });
  }, []);

  return (
    <div>
      <h2>{t('lastSales.title')}</h2> {/* Translate title */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('lastSales.idHeader')}</th> {/* Translate ID */}
            <th>{t('lastSales.customerHeader')}</th> {/* Translate Customer */}
            <th>{t('lastSales.userHeader')}</th> {/* Translate User */}
            <th>{t('lastSales.totalHeader')}</th> {/* Translate Total */}
            <th>{t('lastSales.dateHeader')}</th> {/* Translate Date */}
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LastSales;
