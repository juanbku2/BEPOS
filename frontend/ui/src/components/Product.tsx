import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { Product } from '../types/Product';
import { Supplier } from '../types/Supplier';

const ProductComponent = () => {
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
        New Product
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Barcode</th>
            <th>Sale Price</th>
            <th>Stock</th>
            <th>Supplier</th>
            <th>Actions</th>
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
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? 'Edit' : 'New'} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Barcode</Form.Label>
              <Form.Control type="text" name="barcode" value={form.barcode} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sale Price</Form.Label>
              <Form.Control type="number" name="salePrice" value={form.salePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Min Stock Alert</Form.Label>
              <Form.Control type="number" name="minStockAlert" value={form.minStockAlert} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Supplier</Form.Label>
              <Form.Select value={form.supplier?.id || ''} onChange={handleSupplierChange}>
                <option>Select a supplier</option>
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

export default ProductComponent;
