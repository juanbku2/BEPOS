import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { Supplier } from '../types/Supplier';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SupplierComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
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
        {t('supplier.newSupplier')} {/* Translate New Supplier */}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('supplier.nameHeader')}</th> {/* Translate Name */}
            <th>{t('supplier.contactNameHeader')}</th> {/* Translate Contact Name */}
            <th>{t('supplier.phoneHeader')}</th> {/* Translate Phone */}
            <th>{t('supplier.categoryHeader')}</th> {/* Translate Category */}
            <th>{t('supplier.actionsHeader')}</th> {/* Translate Actions */}
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
                  {t('supplier.editButton')} {/* Translate Edit */}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(supplier.id)}>
                  {t('supplier.deleteButton')} {/* Translate Delete */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t(form.id ? 'supplier.editSupplier' : 'supplier.newSupplier')}</Modal.Title> {/* Translate Edit/New Supplier */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('supplier.nameLabel')}</Form.Label> {/* Translate Name */}
              <Form.Control type="text" name="name" value={form.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('supplier.contactNameLabel')}</Form.Label> {/* Translate Contact Name */}
              <Form.Control type="text" name="contactName" value={form.contactName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('supplier.phoneLabel')}</Form.Label> {/* Translate Phone */}
              <Form.Control type="text" name="phone" value={form.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('supplier.categoryLabel')}</Form.Label> {/* Translate Category */}
              <Form.Control type="text" name="category" value={form.category} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('supplier.closeButton')} {/* Translate Close */}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('supplier.saveChangesButton')} {/* Translate Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupplierComponent;
