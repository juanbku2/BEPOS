import React from 'react';
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import TopNavbar from './TopNavbar'; // Import the new TopNavbar
// import './InvoicePage.css'; // Custom CSS for this component - now handled by AppSidebar.css

interface InvoicePageProps {
  onLogout: () => void;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Define nav items for the Invoice sidebar
  const invoiceNavItems = [
    { key: 'invoice-dashboard', label: t('invoice.dashboard'), onClick: () => navigate('/invoice'), active: true },
    { key: 'create-manual', label: t('invoice.createManual'), onClick: () => console.log('Create Manual Invoice'), active: false },
    { key: 'view-xml-pdf', label: t('invoice.viewXmlPdf'), onClick: () => console.log('View XML/PDF'), active: false },
    { key: 'cancel-invoices', label: t('invoice.cancelInvoices'), onClick: () => console.log('Cancel Invoices'), active: false },
    { key: 'sat-status', label: t('invoice.satStatus'), onClick: () => console.log('SAT Status'), active: false },
  ];

  return (
    <>
      {/* Sidebar for Invoice Module */}
      <AppSidebar
        title=""
        bgColor="var(--bm-blue)"
        navItems={invoiceNavItems}
        onLogout={onLogout}
        // No theme switcher or cash register control for invoice sidebar, so no footerContent needed
      />

      {/* Main Content Area */}
      <div className="content"> {/* Changed from invoice-content-container */}
        <h1 className="mb-4">{t('invoice.title')}</h1>
        <Row className="mb-4">
          <Col md={4}>
            <div className="invoice-card-placeholder">
              <h4>{t('invoice.totalInvoices')}</h4>
              <p>500</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="invoice-card-placeholder">
              <h4>{t('invoice.pendingInvoices')}</h4>
              <p>50</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="invoice-card-placeholder">
              <h4>{t('invoice.totalAmount')}</h4>
              <p>$150,000.00</p>
            </div>
          </Col>
        </Row>

        {/* Placeholder for Table of Invoices */}
        <div className="invoice-table-placeholder">
          <h3>{t('invoice.invoiceList')}</h3>
          <p>{t('invoice.tableContentPlaceholder')}</p>
          {/* A more detailed table implementation would go here */}
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
