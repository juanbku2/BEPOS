import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from '../api/axios';
import { Sale } from '../types/Sale';

const LastSales = () => {
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
      <h2>Last 10 Sales</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>User</th>
            <th>Total</th>
            <th>Date</th>
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
