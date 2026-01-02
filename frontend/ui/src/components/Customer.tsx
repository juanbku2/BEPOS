import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import instance from '../api/axios'; // Import the configured axios instance
import { Customer } from '../types/Customer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CustomerComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Customer>({ id: 0, fullName: '', phone: '', currentDebt: 0 });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    instance.get('/customers') // Use instance and remove /api/v1
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/customers/${form.id}` : '/customers'; // Remove /api/v1

    const customerData = {
      ...form,
      currentDebt: Number(form.currentDebt) || 0,
    };

    instance[method](url, customerData) // Use instance
      .then(() => {
        fetchCustomers();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error saving customer:', error);
      });
  };

  const handleEdit = (customer: Customer) => {
    setForm(customer);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    instance.delete(`/customers/${id}`) // Use instance and remove /api/v1
      .then(() => {
        fetchCustomers();
      })
      .catch(error => {
        console.error('Error deleting customer:', error);
      });
  };

  const handleNew = () => {
    setForm({ id: 0, fullName: '', phone: '', currentDebt: 0 });
    setShowModal(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleNew} className="mb-3">
        {t('customer.newCustomer')} {/* Translate New Customer */}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('customer.fullNameHeader')}</th> {/* Translate Full Name */}
            <th>{t('customer.phoneHeader')}</th> {/* Translate Phone */}
            <th>{t('customer.currentDebtHeader')}</th> {/* Translate Current Debt */}
            <th>{t('customer.actionsHeader')}</th> {/* Translate Actions */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.phone}</td>
              <td>${customer.currentDebt.toFixed(2)}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(customer)} className="me-2">
                  {t('customer.editButton')} {/* Translate Edit */}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(customer.id)}>
                  {t('customer.deleteButton')} {/* Translate Delete */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t(form.id ? 'customer.editCustomer' : 'customer.newCustomer')}</Modal.Title> {/* Translate Edit/New Customer */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('customer.fullNameLabel')}</Form.Label> {/* Translate Full Name */}
              <Form.Control type="text" name="fullName" value={form.fullName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('customer.phoneLabel')}</Form.Label> {/* Translate Phone */}
              <Form.Control type="text" name="phone" value={form.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('customer.currentDebtLabel')}</Form.Label> {/* Translate Current Debt */}
              <Form.Control type="number" name="currentDebt" value={form.currentDebt} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('customer.closeButton')} {/* Translate Close */}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('customer.saveChangesButton')} {/* Translate Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerComponent;
