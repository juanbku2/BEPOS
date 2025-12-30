import { useState } from 'react';
import { Form, Table, Button, InputGroup } from 'react-bootstrap';
import axios from '../api/axios';
import { Customer } from '../types/Customer';

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerSearch = ({ onSelectCustomer }: CustomerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.get(`/api/v1/customers?name=${searchTerm}`)
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
            placeholder="Search for customers by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" type="submit">
            Search
          </Button>
        </InputGroup>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Current Debt</th>
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
                  Select
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
