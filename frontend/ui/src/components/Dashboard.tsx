import { useState } from 'react';
import { Container, Row, Col, Form, Table, Button, Modal, Card, InputGroup } from 'react-bootstrap';
import axios from '../api/axios';

// Import Components
import Sidebar from './Sidebar';
import ProductSearch from './ProductSearch';
import CustomerSearch from './CustomerSearch';
import Checkout from './Checkout';
import LastSales from './LastSales';
import SupplierComponent from './Supplier';
import UserComponent from './User';
import ProductComponent from './Product';
import CustomerComponent from './Customer';

// Import Types
import { Product } from '../types/Product';
import { Customer } from '../types/Customer';
import { SaleItem } from '../types/SaleItem';

// Import Styling & Translation
import { useTranslation } from 'react-i18next';
import '../App.css'; // Main app styles


interface DashboardProps {
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const Dashboard = ({ onLogout, theme, setTheme }: DashboardProps) => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState('pos');

    // POS-specific states
    const [barcode, setBarcode] = useState('');
    const [items, setItems] = useState<SaleItem<Product>[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<{ [key: number]: string }>({});
    
    // Modal states
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    
    // Key for re-rendering sales component
    const [lastSalesKey, setLastSalesKey] = useState(0);

    // --- Data Handling Functions ---
    const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!barcode) return;
        axios.get(`/api/v1/products/barcode/${barcode}`)
            .then(response => addProductToCart(response.data))
            .catch(error => console.error(`Error fetching product with barcode ${barcode}:`, error));
        setBarcode('');
    };

    const addProductToCart = (product: Product, quantity: number = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.product.id === product.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { product, quantity }];
        });
    };
    
    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity > 0) {
            setItems(items.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item));
        } else {
            setItems(items.filter(item => item.product.id !== productId));
        }
    };
    
    const handleQuantityBlur = (item: SaleItem<Product>) => {
        const value = editingQuantity[item.product.id];
        if (value === undefined) return;
        const newQuantity = item.product.unitOfMeasure === 'UNIT' ? parseInt(value, 10) : parseFloat(value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            handleQuantityChange(item.product.id, newQuantity);
        }
        setEditingQuantity(prev => {
            const newState = { ...prev };
            delete newState[item.product.id];
            return newState;
        });
    };

    const calculateTotal = () => items.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);

    const handleSaleComplete = () => {
        setItems([]);
        setSelectedCustomer(null);
        setShowCheckout(false);
        setLastSalesKey(prevKey => prevKey + 1); // Refresh sales view if it's open
    };
    
    // --- View Rendering ---
    const renderPosView = () => (
        <>
            <p>Escanea o introduce el código de barras</p>
            <Row>
                <Col xs={12} md={7} lg={8}>
                    <Form onSubmit={handleBarcodeSubmit} className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <span className="barcode-icon" />
                            </InputGroup.Text>
                            <Form.Control size="lg" type="text" placeholder={t('dashboard.enterBarcode')} value={barcode} onChange={e => setBarcode(e.target.value)} autoFocus />
                        </InputGroup>
                    </Form>
                    <div className="d-flex gap-2 mb-3">
                        <Button variant="primary" onClick={() => setShowProductSearch(true)}>{t('dashboard.searchProduct')}</Button>
                        <Button variant="info" onClick={() => setShowCustomerSearch(true)}>{t('dashboard.searchCustomer')}</Button>
                        <Button variant="secondary" onClick={() => setCurrentView('sales')}>{t('dashboard.lastSales')}</Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>{t('dashboard.nameHeader')}</th>
                                <th className="text-end">{t('dashboard.priceHeader')}</th>
                                <th style={{ width: '150px' }}>{t('dashboard.quantityHeader')}</th>
                                <th className="text-end">{t('dashboard.subtotalHeader')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.product.id}>
                                    <td>{item.product.name}</td>
                                    <td className="text-end">${item.product.salePrice.toFixed(2)}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Form.Control type="number" step={item.product.unitOfMeasure === 'UNIT' ? "1" : "0.001"} value={editingQuantity[item.product.id] ?? item.quantity} onChange={(e) => setEditingQuantity({ ...editingQuantity, [item.product.id]: e.target.value })} onBlur={() => handleQuantityBlur(item)} className="mx-1 text-center quantity-input" />
                                        </div>
                                    </td>
                                    <td className="text-end">${(item.product.salePrice * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col xs={12} md={5} lg={4} className="checkout-col">
                    <Card className="checkout-card">
                        <Card.Body className="text-center">
                             <div className="total-display-container">
                                <Card.Title>{t('dashboard.total')}</Card.Title>
                                <Card.Text as="div" className="total-display">${calculateTotal().toFixed(2)}</Card.Text>
                            </div>
                            {selectedCustomer && <div className="mb-3"><strong>{selectedCustomer.fullName}</strong></div>}
                            <div className="d-grid">
                                <Button variant="success" size="lg" onClick={() => setShowCheckout(true)} disabled={items.length === 0}>{t('dashboard.checkout')}</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'pos':       return renderPosView();
            case 'products':  return <ProductComponent />;
            case 'customers': return <CustomerComponent />;
            case 'suppliers': return <SupplierComponent />;
            case 'sales':     return <LastSales key={lastSalesKey} />;
            case 'users':     return <UserComponent />;
            default:          return renderPosView();
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar onSelect={setCurrentView} onLogout={onLogout} setTheme={setTheme} theme={theme} currentView={currentView} />
            <div className="content-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2">{t('dashboard.posScreen')}</h1>
                    <Button variant="outline-secondary" onClick={onLogout}>{t('dashboard.logout')}</Button>
                </div>
                {renderCurrentView()}
            </div>
            
            {/* Modals for POS view */}
            <Modal show={showProductSearch} onHide={() => setShowProductSearch(false)} size="lg"><Modal.Header closeButton><Modal.Title>{t('dashboard.searchProduct')}</Modal.Title></Modal.Header><Modal.Body><ProductSearch onAddProduct={(p) => { addProductToCart(p, p.unitOfMeasure === 'UNIT' ? 1 : 0.5); setShowProductSearch(false); }} /></Modal.Body></Modal>
            <Modal show={showCustomerSearch} onHide={() => setShowCustomerSearch(false)} size="lg"><Modal.Header closeButton><Modal.Title>{t('dashboard.searchCustomer')}</Modal.Title></Modal.Header><Modal.Body><CustomerSearch onSelectCustomer={(c) => { setSelectedCustomer(c); setShowCustomerSearch(false); }} /></Modal.Body></Modal>
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)}><Modal.Header closeButton><Modal.Title>{t('dashboard.checkout')}</Modal.Title></Modal.Header><Modal.Body><Checkout items={items.map(it => ({ productId: it.product.id, quantity: it.quantity, price: it.product.salePrice }))} customer={selectedCustomer} total={calculateTotal()} onSaleComplete={handleSaleComplete} /></Modal.Body></Modal>
        </div>
    );
};

export default Dashboard;
