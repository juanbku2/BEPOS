import { useCashRegister } from '../context/CashRegisterContext';
import { Alert, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { Container, Row, Col, Form, Table, Button, Modal, Card, InputGroup } from 'react-bootstrap';
import instance from '../api/axios';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

// Import Components
import AppSidebar from './AppSidebar';
import ProductSearch from './ProductSearch';
import CustomerSearch from './CustomerSearch';
import Checkout from './Checkout';
import InvoiceModal from './InvoiceModal';
import { CashRegisterControl } from './CashRegisterControl';

// Import Types
import { Product } from '../types/Product';
import { Customer } from '../types/Customer';
import { SaleItem } from '../types/SaleItem';
import { Sale } from '../types/Sale';

// Import Styling & Translation
import { useTranslation } from 'react-i18next';
import '../App.css';


interface DashboardProps {
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const Dashboard = ({ onLogout, theme, setTheme }: DashboardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    
    const posNavItems = [
        { key: 'pos', icon: '🛒', label: t('dashboard.posScreen'), onClick: () => navigate('/pos'), active: location.pathname === '/pos' },
        { key: 'products', icon: '📦', label: t('dashboard.products'), onClick: () => navigate('/pos/products'), active: location.pathname.startsWith('/pos/products') },
        { key: 'customers', icon: '👥', label: t('dashboard.customers'), onClick: () => navigate('/pos/customers'), active: location.pathname.startsWith('/pos/customers') },
        { key: 'reports', icon: '📈', label: t('dashboard.reports'), onClick: () => navigate('/reports'), active: location.pathname.startsWith('/reports') },
        { key: 'suppliers', icon: '🚚', label: t('dashboard.suppliers'), onClick: () => navigate('/pos/suppliers'), active: location.pathname.startsWith('/pos/suppliers') },
        { key: 'users', icon: '👨‍💼', label: t('dashboard.users'), onClick: () => navigate('/pos/users'), active: location.pathname.startsWith('/pos/users') },
    ];

    const posFooterContent = (
      <>
        <CashRegisterControl />
      </>
    );

    return (
        <>
            <AppSidebar
                title=""
                bgColor="var(--bm-green)"
                navItems={posNavItems}
                onLogout={onLogout}
                theme={theme}
                setTheme={setTheme}
                footerContent={posFooterContent}
            />
            <div className="content">
                <Outlet />
            </div>
        </>
    );
};

export const PosView = () => {
    const { t } = useTranslation();
    const { status: cashRegisterStatus } = useCashRegister();
    const isCashRegisterClosed = cashRegisterStatus === 'CLOSED';
    
    const [barcode, setBarcode] = useState('');
    const [items, setItems] = useState<SaleItem<Product>[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<{ [key: number]: string }>({});
    
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);

    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedSaleToInvoice, setSelectedSaleToInvoice] = useState<Sale | null>(null);
    
    const [lastSalesKey, setLastSalesKey] = useState(0);

    const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!barcode || isCashRegisterClosed) return;
        instance.get(`/products/barcode/${barcode}`)
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
        setItems(currentItems => {
            if (newQuantity > 0) {
                return currentItems.map(item =>
                    item.product.id === productId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                return currentItems.filter(item => item.product.id !== productId);
            }
        });
    };

     const handleStepChange = (item: SaleItem<Product>, step: number) => {
        const currentQuantity = items.find(i => i.product.id === item.product.id)?.quantity || 0;
        const newQuantity = currentQuantity + step;
        handleQuantityChange(item.product.id, newQuantity);
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

    const handleOpenCheckout = () => {
        const newTotal = items.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
        setCheckoutTotal(newTotal);
        setShowCheckout(true);
    };

    const handleSaleComplete = () => {
        setItems([]);
        setSelectedCustomer(null);
        setShowCheckout(false);
        setLastSalesKey(prevKey => prevKey + 1);
    };

    return (
        <>
            {isCashRegisterClosed && <Alert variant="warning">{t('cashRegister.closedMessage')}</Alert>}
            <p>Escanea o introduce el código de barras</p>
            <Row>
                <Col xs={12} md={7} lg={8}>
                    <Form onSubmit={handleBarcodeSubmit} className="mb-3">
                         <InputGroup>
                            <InputGroup.Text>
                                <span className="barcode-icon" />
                            </InputGroup.Text>
                            <Form.Control size="lg" type="text" placeholder={t('dashboard.enterBarcode')} value={barcode} onChange={e => setBarcode(e.target.value)} autoFocus disabled={isCashRegisterClosed} />
                        </InputGroup>
                    </Form>
                    <div className="d-flex gap-2 mb-3">
                        <Button variant="primary" onClick={() => setShowProductSearch(true)} disabled={isCashRegisterClosed}>{t('dashboard.searchProduct')}</Button>
                        <Button variant="info" onClick={() => setShowCustomerSearch(true)} disabled={isCashRegisterClosed}>{t('dashboard.searchCustomer')}</Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>{t('dashboard.nameHeader')}</th>
                                <th className="text-end">{t('dashboard.priceHeader')}</th>
                                <th style={{ width: '170px' }}>{t('dashboard.quantityHeader')}</th>
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
                                            <Button size="sm" className="quantity-btn" variant="outline-secondary" onClick={() => handleStepChange(item, item.product.unitOfMeasure === 'UNIT' ? -1 : -0.01)} disabled={isCashRegisterClosed}>-</Button>
                                            <Form.Control type="number" step={item.product.unitOfMeasure === 'UNIT' ? "1" : "0.001"} value={editingQuantity[item.product.id] ?? item.quantity} onChange={(e) => setEditingQuantity({ ...editingQuantity, [item.product.id]: e.target.value })} onBlur={() => handleQuantityBlur(item)} className="mx-1 text-center quantity-input" disabled={isCashRegisterClosed} />
                                            <Button size="sm" className="quantity-btn" variant="outline-secondary" onClick={() => handleStepChange(item, item.product.unitOfMeasure === 'UNIT' ? 1 : 0.01)} disabled={isCashRegisterClosed}>+</Button>
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
                                <Card.Text as="div" className="total-display">${items.reduce((total, item) => total + item.product.salePrice * item.quantity, 0).toFixed(2)}</Card.Text>
                            </div>
                            {selectedCustomer && <div className="mb-3"><strong>{selectedCustomer.fullName}</strong></div>}
                            <div className="d-grid">
                                <Button variant="success" size="lg" onClick={handleOpenCheckout} disabled={items.length === 0 || isCashRegisterClosed}>{t('dashboard.checkout')}</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showProductSearch} onHide={() => setShowProductSearch(false)} size="lg"><Modal.Header closeButton><Modal.Title>{t('dashboard.searchProduct')}</Modal.Title></Modal.Header><Modal.Body><ProductSearch onAddProduct={(p) => { addProductToCart(p, p.unitOfMeasure === 'UNIT' ? 1 : 0.5); setShowProductSearch(false); }} /></Modal.Body></Modal>
            <Modal show={showCustomerSearch} onHide={() => setShowCustomerSearch(false)} size="lg"><Modal.Header closeButton><Modal.Title>{t('dashboard.searchCustomer')}</Modal.Title></Modal.Header><Modal.Body><CustomerSearch onSelectCustomer={(c) => { setSelectedCustomer(c); setShowCustomerSearch(false); }} /></Modal.Body></Modal>
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)}><Modal.Header closeButton><Modal.Title>{t('dashboard.checkout')}</Modal.Title></Modal.Header><Modal.Body><Checkout items={items.map(it => ({ productId: it.product.id, quantity: it.quantity, price: it.product.salePrice }))} customer={selectedCustomer} total={checkoutTotal} onSaleComplete={handleSaleComplete} /></Modal.Body></Modal>
        </>
    );
};

export default Dashboard;
