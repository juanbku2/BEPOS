import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { Supplier } from '../types/Supplier';

const SupplierComponent = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Supplier>({ id: 0, name: '', contactName: '', phone: '', category: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios.get('/api/v1/suppliers')
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/v1/suppliers/${form.id}` : '/api/v1/suppliers';

    axios[method](url, form)
      .then(() => {
        fetchSuppliers();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error saving supplier:', error);
      });
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/v1/suppliers/${id}`)
      .then(() => {
        fetchSuppliers();
      })
      .catch(error => {
        console.error('Error deleting supplier:', error);
      });
  };

  const handleNew = () => {
    setForm({ id: 0, name: '', contactName: '', phone: '', category: '' });
    setShowModal(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleNew} className="mb-3">
        New Supplier
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Name</th>
            <th>Phone</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.category}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(supplier)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(supplier.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Edit' : 'New'} Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Name</Form.Label>
              <Form.Control type="text" name="contactName" value={form.contactName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={form.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={form.category} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupplierComponent;
