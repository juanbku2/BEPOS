import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ModuleSelector.css'; // Custom CSS for this component

const ModuleSelector: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectModule = (path: string) => {
    navigate(path);
  };

  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <h1 className="text-center module-selector-title">{t('moduleSelector.title')}</h1>
      <Row className="justify-content-center" style={{ width: '80%', maxWidth: '800px' }}>
        <Col md={6} className="mb-4">
          <Card
            className="text-center p-4 module-selector-card pos-card"
            onClick={() => handleSelectModule('/pos')}
          >
            <Card.Body>
              <Card.Title as="h2">BM POS</Card.Title>
              <Card.Text>{t('moduleSelector.posSubtitle')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card
            className="text-center p-4 module-selector-card invoice-card"
            onClick={() => handleSelectModule('/invoice')}
          >
            <Card.Body>
              <Card.Title as="h2">BM Invoice</Card.Title>
              <Card.Text>{t('moduleSelector.invoiceSubtitle')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModuleSelector;
