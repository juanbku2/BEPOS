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

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
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
                    <h1>POS Screen</h1>
                    <Form onSubmit={handleBarcodeSubmit}>
                        <Form.Group>
                            <Form.Label>Barcode</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter barcode"
                                value={barcode}
                                onChange={handleBarcodeChange}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                    <Button variant="info" className="my-3 me-2" onClick={() => setShowProductSearch(true)}>
                        Search for Product
                    </Button>
                    <Button variant="info" className="my-3 me-2" onClick={() => setShowCustomerSearch(true)}>
                        Search for Customer
                    </Button>
                    <Button variant="secondary" className="my-3 me-2" onClick={() => setShowLastSales(true)}>
                        Last Sales
                    </Button>
                    <Button variant="dark" className="my-3 me-2" onClick={() => setShowSuppliers(true)}>
                        Suppliers
                    </Button>
                    <Button variant="danger" className="my-3 me-2" onClick={() => setShowUsers(true)}>
                        Users
                    </Button>
                    <Button variant="success" className="my-3 me-2" onClick={() => setShowProducts(true)}>
                        Products
                    </Button>
                    <Button variant="primary" className="my-3 me-2" onClick={() => setShowCustomers(true)}>
                        Customers
                    </Button>
                    <Button variant="warning" className="my-3" onClick={onLogout}>
                        Logout
                    </Button>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
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
                    <h2>Total</h2>
                    <h3>${calculateTotal().toFixed(2)}</h3>
                    {selectedCustomer && (
                        <div>
                            <h4>Customer: {selectedCustomer.fullName}</h4>
                        </div>
                    )}
                    <div className="d-grid">
                        <Button variant="primary" onClick={() => setShowCheckout(true)} disabled={items.length === 0}>
                            Checkout
                        </Button>
                    </div>
                </Col>
            </Row>
            <Modal show={showProductSearch} onHide={() => setShowProductSearch(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Search for Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductSearch onAddProduct={handleAddProduct} />
                </Modal.Body>
            </Modal>
            <Modal show={showCustomerSearch} onHide={() => setShowCustomerSearch(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Search for Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerSearch onSelectCustomer={handleSelectCustomer} />
                </Modal.Body>
            </Modal>
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
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
                    <Modal.Title>Last 10 Sales</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LastSales key={lastSalesKey} />
                </Modal.Body>
            </Modal>
            <Modal show={showSuppliers} onHide={() => setShowSuppliers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Suppliers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SupplierComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showUsers} onHide={() => setShowUsers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showProducts} onHide={() => setShowProducts(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Products</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductComponent />
                </Modal.Body>
            </Modal>
            <Modal show={showCustomers} onHide={() => setShowCustomers(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Customers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomerComponent />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;
