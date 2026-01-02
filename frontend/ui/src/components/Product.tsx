import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import axios from '../api/axios';
import { Product } from '../types/Product';
import { Supplier } from '../types/Supplier';
import { useTranslation } from 'react-i18next';
import StockAdjustmentModal from './StockAdjustmentModal';
import InventoryHistoryModal from './InventoryHistoryModal';

// Temporary type for form as ProductRequest
interface ProductFormType {
  id?: number;
  name: string;
  barcode: string;
  purchasePrice: number;
  salePrice: number;
  initialStock?: number; // Only for creation
  minStock: number;
  unitOfMeasure?: 'KG' | 'LITER' | 'UNIT'; // Made optional
  supplierId?: number | null; // Changed to supplierId
}


const ProductComponent = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormType>({ name: '', barcode: '', purchasePrice: 0, salePrice: 0, minStock: 0, unitOfMeasure: 'UNIT', initialStock: 0 });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = () => {
    axios.get<Product[]>('/products') // Now expects Product[] (which is ProductResponse)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const fetchSuppliers = () => {
    axios.get<Supplier[]>('/suppliers')
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = parseInt(e.target.value, 10);
    setForm({ ...form, supplierId: supplierId || null });
  };

  const handleSave = () => {
    const isNew = form.id === undefined || form.id === 0;
    const method = isNew ? 'post' : 'put';
    const url = isNew ? '/products' : `/products/${form.id}`;

    const productRequestData = {
        name: form.name,
        barcode: form.barcode,
        purchasePrice: form.purchasePrice,
        salePrice: form.salePrice,
        minStock: form.minStock,
        unitOfMeasure: form.unitOfMeasure,
        supplierId: form.supplierId,
        ...(isNew && { initialStock: form.initialStock }) // Only send initialStock on create
    };
    
    axios[method](url, productRequestData)
      .then(() => {
        fetchProducts();
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error saving product:', error);
      });
  };

  const handleEdit = (product: Product) => {
    setForm({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        minStock: product.minStock,
        unitOfMeasure: product.unitOfMeasure,
        supplierId: product.supplier?.id || null, // Access supplier via product if available
    });
    setSelectedProduct(product); // Set selected product for modals
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    axios.delete(`/products/${id}`)
      .then(() => {
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  const handleNew = () => {
    setForm({ name: '', barcode: '', purchasePrice: 0, salePrice: 0, minStock: 0, unitOfMeasure: 'UNIT', initialStock: 0 });
    setSelectedProduct(null); // Clear selected product for new form
    setShowModal(true);
  };
  
  const handleOpenAdjust = (product: Product) => {
    setSelectedProduct(product);
    setShowAdjustModal(true);
  }

  const handleOpenHistory = (product: Product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  }

  return (
    <div>
      <Button variant="primary" onClick={handleNew} className="mb-3">
        {t('product.newProduct')}
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t('product.nameHeader')}</th>
            <th>{t('product.barcodeHeader')}</th>
            <th>{t('product.salePriceHeader')}</th>
            <th>{t('product.stockHeader')}</th>
            <th>{t('product.actionsHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={product.lowStock ? 'table-danger' : ''}>
              <td>{product.name}</td>
              <td>{product.barcode}</td>
              <td>${product.salePrice.toFixed(2)}</td>
              <td>
                {product.stock} {product.unitOfMeasure ? t(`product.units.${product.unitOfMeasure.toLowerCase()}` as any) : ''}
                {product.lowStock && 
                  <Badge bg="danger" className="ms-2">{t('product.lowStock')}</Badge>
                }
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    {t('product.actionsHeader')}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(product)}>{t('product.editButton')}</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOpenAdjust(product)}>{t('inventory.adjustStockTitle')}</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOpenHistory(product)}>{t('inventory.historyTitle')}</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => handleDelete(product.id)} className="text-danger">{t('product.deleteButton')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t(form.id ? 'product.editProduct' : 'product.newProduct')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5>{t('product.productInfo')}</h5>
            <hr/>
            <Form.Group className="mb-3">
              <Form.Label>{t('product.nameLabel')}</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('product.barcodeLabel')}</Form.Label>
              <Form.Control type="text" name="barcode" value={form.barcode} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('product.purchasePriceLabel')}</Form.Label>
              <Form.Control type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('product.salePriceLabel')}</Form.Label>
              <Form.Control type="number" name="salePrice" value={form.salePrice} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('product.supplierLabel')}</Form.Label>
              <Form.Select name="supplierId" value={form.supplierId || ''} onChange={handleSupplierChange}>
                <option value="">{t('product.selectSupplier')}</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t('product.unitOfMeasureLabel')}</Form.Label>
                <Form.Select name="unitOfMeasure" value={form.unitOfMeasure || 'UNIT'} onChange={handleInputChange}>
                    <option value="KG">KG</option>
                    <option value="LITER">LITER</option>
                    <option value="UNIT">UNIT</option>
                </Form.Select>
            </Form.Group>
            
            <h5 className="mt-4">{t('product.inventoryInfo')}</h5>
            <hr/>
            {!form.id && (
              <Form.Group className="mb-3">
                <Form.Label>{t('product.initialStock')}</Form.Label>
                <Form.Control type="number" name="initialStock" value={form.initialStock} onChange={handleInputChange} />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>{t('product.minStockAlertLabel')}</Form.Label>
              <Form.Control type="number" name="minStock" value={form.minStock} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('buttons.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t('product.saveChangesButton')}
          </Button>
        </Modal.Footer>
      </Modal>

      <StockAdjustmentModal show={showAdjustModal} onHide={() => setShowAdjustModal(false)} product={selectedProduct} onAdjust={fetchProducts} />
      <InventoryHistoryModal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} product={selectedProduct} />

    </div>
  );
};

export default ProductComponent;

