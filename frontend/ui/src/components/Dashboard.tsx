import { useState } from 'react';
import { Container, Row, Col, Form, Table, Button, Modal } from 'react-bootstrap';
import axios from '../api/axios';
import ProductSearch from './ProductSearch';
import CustomerSearch from './CustomerSearch';
import Checkout from './Checkout';
import LastSales from './LastSales';
import SupplierComponent from './Supplier';
import UserComponent from './User';
import ProductComponent from './Product';
import CustomerComponent from './Customer';
import { Product } from '../types/Product';
import { Customer } from '../types/Customer';
import { SaleItem } from '../types/SaleItem';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
    const { t } = useTranslation(); // Initialize useTranslation
    const [barcode, setBarcode] = useState('');
    const [items, setItems] = useState<SaleItem<Product>[]>([]);
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showLastSales, setShowLastSales] = useState(false);
    const [showSuppliers, setShowSuppliers] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showCustomers, setShowCustomers] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [lastSalesKey, setLastSalesKey] = useState(0);

    const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBarcode(e.target.value);
    };

    const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.get(`/api/v1/products/barcode/${barcode}`)
            .then(response => {
                const product = response.data;
                const existingItem = items.find(item => item.product.id === product.id);
                if (existingItem) {
                    setItems(items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
                } else {
                    setItems([...items, { product: product, quantity: 1 }]);
                }
            })
            .catch(error => {
                console.error(`Error fetching product with barcode ${barcode}:`, error);
                // Handle error, e.g., show a "product not found" message
            });
        setBarcode('');
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    };

    const handleAddProduct = (product: Product) => {
        const existingItem = items.find(item => item.product.id === product.id);
        if (existingItem) {
            setItems(items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setItems([...items, { product: product, quantity: 1 }]);
        }
        setShowProductSearch(false);
    }

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowCustomerSearch(false);
    }

    const handleSaleComplete = () => {
        setItems([]);
        setSelectedCustomer(null);
        setShowCheckout(false);
        setLastSalesKey(prevKey => prevKey + 1);
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={8}>
                    <h1>{t('dashboard.posScreen')}</h1> {/* Translate POS Screen */}
                    <Form onSubmit={handleBarcodeSubmit}>
                        <Form.Group>
                            <Form.Label>{t('dashboard.barcode')}</Form.Label> {/* Translate Barcode */}
                            {/* Translate Enter barcode */}
                            <Form.Control
                                type="text"
                                placeholder={t('dashboard.enterBarcode')}
                                value={barcode}
                                onChange={handleBarcodeChange}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                    <Button variant="info" className="my-3 me-2" onClick={() => setShowProductSearch(true)}>
                        {t('dashboard.searchProduct')} {/* Translate Search for Product */}
                    </Button>
                    <Button variant="info" className="my-3 me-2" onClick={() => setShowCustomerSearch(true)}>
                        {t('dashboard.searchCustomer')} {/* Translate Search for Customer */}
                    </Button>
                    <Button variant="secondary" className="my-3 me-2" onClick={() => setShowLastSales(true)}>
                        {t('dashboard.lastSales')} {/* Translate Last Sales */}
                    </Button>
                    <Button variant="dark" className="my-3 me-2" onClick={() => setShowSuppliers(true)}>
                        {t('dashboard.suppliers')} {/* Translate Suppliers */}
                    </Button>
                    <Button variant="danger" className="my-3 me-2" onClick={() => setShowUsers(true)}>
                        {t('dashboard.users')} {/* Translate Users */}
                    </Button>
                    <Button variant="success" className="my-3 me-2" onClick={() => setShowProducts(true)}>
                        {t('dashboard.products')} {/* Translate Products */}
                    </Button>
                    <Button variant="primary" className="my-3 me-2" onClick={() => setShowCustomers(true)}>
                        {t('dashboard.customers')} {/* Translate Customers */}
                    </Button>
                    <Button variant="warning" className="my-3" onClick={onLogout}>
                        {t('dashboard.logout')} {/* Translate Logout */}
                    </Button>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>{t('dashboard.barcodeHeader')}</th> {/* Translate Barcode Header */}
                                <th>{t('dashboard.nameHeader')}</th> {/* Translate Name Header */}
                                <th>{t('dashboard.priceHeader')}</th> {/* Translate Price Header */}
                                <th>{t('dashboard.quantityHeader')}</th> {/* Translate Quantity Header */}
                                <th>{t('dashboard.subtotalHeader')}</th> {/* Translate Subtotal Header */}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product.barcode}</td>
                                    <td>{item.product.name}</td>
                                    <td>${item.product.salePrice.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(item.product.salePrice * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col xs={4} className="bg-light p-3">
                    <h2>{t('dashboard.total')}</h2> {/* Translate Total */}
                    <h3>${calculateTotal().toFixed(2)}</h3>
                    {selectedCustomer && (
                        <div>
                            <h4>{t('dashboard.customer')}: {selectedCustomer.fullName}</h4> {/* Translate Customer */}
                        </div>
                    )}
                    <div className="d-grid">
                        <Button variant="primary" onClick={() => setShowCheckout(true)} disabled={items.length === 0}>
                            {t('dashboard.checkout')} {/* Translate Checkout */}
                        </Button>
                    </div>
                </Col>
            </Row>
            <Modal show={showProductSearch} onHide={() => setShowProductSearch(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.searchProduct')}</Modal.Title> {/* Translate Search for Product */}
                </Modal.Header>
                <Modal.Body>
                    <ProductSearch onAddProduct={handleAddProduct} />
                </Modal.Body>
            </Modal>
            <Modal show={showCustomerSearch} onHide={() => setShowCustomerSearch(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.searchCustomer')}</Modal.Title> {/* Translate Search for Customer */}
                </Modal.Header>
                <Modal.Body>
                    <CustomerSearch onSelectCustomer={handleSelectCustomer} />
                </Modal.Body>
            </Modal>
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.checkout')}</Modal.Title> {/* Translate Checkout */}
                </Modal.Header>
                <Modal.Body>
                    <Checkout
                        items={items.map(item => ({ productId: item.product.id, quantity: item.quantity, price: item.product.salePrice }))}
                        customer={selectedCustomer}
                        total={calculateTotal()}
                        onSaleComplete={handleSaleComplete}
                    />
                </Modal.Body>
            </Modal>
            <Modal show={showLastSales} onHide={() => setShowLastSales(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.lastSales')}</Modal.Title> {/* Translate Last 10 Sales */}
                </Modal.Header>
                <Modal.Body>
                    <LastSales key={lastSalesKey} />
                </Modal.Body>
            </Modal>
            <Modal show={showSuppliers} onHide={() => setShowSuppliers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.suppliers')}</Modal.Title> {/* Translate Suppliers */}
                </Modal.Header>
                <Modal.Body>
                    <SupplierComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showUsers} onHide={() => setShowUsers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.users')}</Modal.Title> {/* Translate Users */}
                </Modal.Header>
                <Modal.Body>
                    <UserComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showProducts} onHide={() => setShowProducts(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.products')}</Modal.Title> {/* Translate Products */}
                </Modal.Header>
                <Modal.Body>
                    <ProductComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showCustomers} onHide={() => setShowCustomers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{t('dashboard.customers')}</Modal.Title> {/* Translate Customers */}
                </Modal.Header>
                <Modal.Body>
                    <CustomerComponent />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;
