import { useState } from 'react';
import { Form, Table, Button, InputGroup } from 'react-bootstrap';
import instance from '../api/axios'; // Import the configured axios instance
import { Customer } from '../types/Customer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerSearch = ({ onSelectCustomer }: CustomerSearchProps) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    instance.get(`/customers?name=${searchTerm}`) // Use instance and remove /api/v1
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error(`Error fetching customers with name ${searchTerm}:`, error);
      });
  };

  return (
    <div>
      <Form onSubmit={handleSearchSubmit}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('customerSearch.searchPlaceholder')} // Translate placeholder
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" type="submit">
            {t('customerSearch.searchButton')} {/* Translate Search button */}
          </Button>
        </InputGroup>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('customerSearch.nameHeader')}</th> {/* Translate Name */}
            <th>{t('customerSearch.phoneHeader')}</th> {/* Translate Phone */}
            <th>{t('customerSearch.currentDebtHeader')}</th> {/* Translate Current Debt */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.phone}</td>
              <td>${customer.currentDebt}</td>
              <td>
                <Button variant="success" onClick={() => onSelectCustomer(customer)}>
                  {t('customerSearch.selectButton')} {/* Translate Select button */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerSearch;
