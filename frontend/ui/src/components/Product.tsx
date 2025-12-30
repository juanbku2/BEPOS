import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { Product } from '../types/Product';
import { Supplier } from '../types/Supplier';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ProductComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Product>({ id: 0, name: '', barcode: '', purchasePrice: 0, salePrice: 0, stockQuantity: 0, minStockAlert: 0, supplier: null });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/v1/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

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

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = parseInt(e.target.value, 10);
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setForm({ ...form, supplier });
    }
  };

  const handleSave = () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/v1/products/${form.id}` : '/api/v1/products';

    const productData = {
      ...form,
      purchasePrice: Number(form.purchasePrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      stockQuantity: Number(form.stockQuantity) || 0,
      minStockAlert: Number(form.minStockAlert) || 0,
    };

    axios[method](url, productData)
      .then(() => {
        fetchProducts();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error saving product:', error);
      });
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/v1/products/${id}`)
      .then(() => {
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  const handleNew = () => {
    setForm({ id: 0, name: '', barcode: '', purchasePrice: 0, salePrice: 0, stockQuantity: 0, minStockAlert: 0, supplier: null });
    setShowModal(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleNew} className="mb-3">
        {t('product.newProduct')} {/* Translate New Product */}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('product.nameHeader')}</th> {/* Translate Name */}
            <th>{t('product.barcodeHeader')}</th> {/* Translate Barcode */}
            <th>{t('product.salePriceHeader')}</th> {/* Translate Sale Price */}
            <th>{t('product.stockHeader')}</th> {/* Translate Stock */}
            <th>{t('product.supplierHeader')}</th> {/* Translate Supplier */}
            <th>{t('product.actionsHeader')}</th> {/* Translate Actions */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.barcode}</td>
              <td>${product.salePrice.toFixed(2)}</td>
              <td>{product.stockQuantity}</td>
              <td>{product.supplier?.name}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(product)} className="me-2">
                  {t('product.editButton')} {/* Translate Edit */}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>
                  {t('product.deleteButton')} {/* Translate Delete */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t(form.id ? 'product.editProduct' : 'product.newProduct')}</Modal.Title> {/* Translate Edit/New Product */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('product.nameLabel')}</Form.Label> {/* Translate Name */}
              <Form.Control type="text" name="name" value={form.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.barcodeLabel')}</Form.Label> {/* Translate Barcode */}
              <Form.Control type="text" name="barcode" value={form.barcode} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.purchasePriceLabel')}</Form.Label> {/* Translate Purchase Price */}
              <Form.Control type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.salePriceLabel')}</Form.Label> {/* Translate Sale Price */}
              <Form.Control type="number" name="salePrice" value={form.salePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.stockQuantityLabel')}</Form.Label> {/* Translate Stock Quantity */}
              <Form.Control type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.minStockAlertLabel')}</Form.Label> {/* Translate Min Stock Alert */}
              <Form.Control type="number" name="minStockAlert" value={form.minStockAlert} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('product.supplierLabel')}</Form.Label> {/* Translate Supplier */}
              <Form.Select value={form.supplier?.id || ''} onChange={handleSupplierChange}>
                <option>{t('product.selectSupplier')}</option> {/* Translate Select a supplier */}
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('product.closeButton')} {/* Translate Close */}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('product.saveChangesButton')} {/* Translate Save Changes */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductComponent;
