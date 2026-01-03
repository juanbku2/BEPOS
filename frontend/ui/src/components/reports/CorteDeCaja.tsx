import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Row, Spinner, Alert } from 'react-bootstrap';
import ReportLayout from './ReportLayout';
import { useCashRegister } from '../../context/CashRegisterContext';
import { getCashRegisterClosureReport } from '../../api/reports';
import { CashRegisterClosureReportDTO } from '../../types/reports';
import './CorteDeCaja.css';

const CorteDeCaja: React.FC = () => {
    const { t } = useTranslation();
    const { cashRegister: currentRegister, status: registerStatus, isLoading: isRegisterLoading } = useCashRegister();
    
    const [reportData, setReportData] = useState<CashRegisterClosureReportDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentRegister?.id) {
            setIsLoading(true);
            getCashRegisterClosureReport(currentRegister.id)
                .then(data => {
                    setReportData(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Failed to fetch cash register report", err);
                    setError(t('errors.unexpected'));
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isRegisterLoading) {
            // If there's no current register and we're not loading, it's likely closed
            setIsLoading(false);
        }
    }, [currentRegister, isRegisterLoading, t]);

    const renderOpenRegisterView = () => (
        <div className="corte-de-caja-content">
            <p className="lead">{t('reports.corte.openSubtitle')}</p>
            <Row>
                <Col md={4}><SummaryCard title={t('reports.corte.totalSales')} value={currentRegister?.totalSales} /></Col>
                <Col md={4}><SummaryCard title={t('reports.corte.totalCash')} value={currentRegister?.totalCash} /></Col>
                <Col md={4}><SummaryCard title={t('reports.corte.totalCard')} value={currentRegister?.totalCard} /></Col>
            </Row>
            <div className="text-center mt-4">
                <Button variant="danger" size="lg">{t('reports.corte.closeButton')}</Button>
            </div>
        </div>
    );

    const renderClosedRegisterView = () => (
        <div className="corte-de-caja-content">
            {reportData ? (
                 <>
                    <p className="lead">{t('reports.corte.lastClosureTitle')}</p>
                     <ClosureDetails data={reportData} />
                 </>
            ) : (
                <Alert variant="info">{t('reports.corte.noData')}</Alert>
            )}
        </div>
    );

    const filterBarContent = (
        <div className="d-flex justify-content-between align-items-center w-100">
            <span>{t('reports.corte.filterTitle')}</span>
            {/* Can add a date picker for past closures here later */}
        </div>
    );

    return (
        <ReportLayout title={t('reports.corte.title')} filterBar={filterBarContent}>
            {isLoading || isRegisterLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>{t('common.loading')}</p>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : registerStatus === 'OPEN' ? (
                renderOpenRegisterView()
            ) : (
                renderClosedRegisterView()
            )}
        </ReportLayout>
    );
};

// Helper component for summary cards
const SummaryCard: React.FC<{ title: string; value?: number }> = ({ title, value }) => (
    <Card className="summary-card">
        <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
                ${(value || 0).toFixed(2)}
            </Card.Text>
        </Card.Body>
    </Card>
);

// Helper component for displaying closure details
const ClosureDetails: React.FC<{ data: CashRegisterClosureReportDTO }> = ({ data }) => (
    <Card>
        <Card.Header>Resumen del Cierre #{data.cashRegisterId}</Card.Header>
        <Card.Body>
            <Row>
                <Col md={6}>
                    <p><strong>Abierto por:</strong> {data.openedBy} el {new Date(data.openedAt).toLocaleString()}</p>
                    <p><strong>Cerrado por:</strong> {data.closedBy} el {data.closedAt ? new Date(data.closedAt).toLocaleString() : 'N/A'}</p>
                </Col>
                <Col md={6}>
                    <p><strong>Estado:</strong> <span className={`status-${data.status.toLowerCase()}`}>{data.status}</span></p>
                </Col>
            </Row>
            <hr />
            <Row className="closure-financials">
                <Col><p><span>Saldo Inicial:</span> <strong>${data.initialCash.toFixed(2)}</strong></p></Col>
                <Col><p><span>Ventas Totales:</span> <strong>${data.totalSales?.toFixed(2)}</strong></p></Col>
                <Col><p><span>Dinero en Sistema:</span> <strong>${data.systemCash?.toFixed(2)}</strong></p></Col>
                <Col><p><span>Dinero Contado:</span> <strong>${data.countedCash?.toFixed(2)}</strong></p></Col>
                <Col><p className={data.cashDifference && data.cashDifference < 0 ? 'text-danger' : ''}><span>Diferencia:</span> <strong>${data.cashDifference?.toFixed(2)}</strong></p></Col>
            </Row>
        </Card.Body>
    </Card>
);


export default CorteDeCaja;
