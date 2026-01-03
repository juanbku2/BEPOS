import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import ReportLayout from './ReportLayout';
import { getSalesByDateReport } from '../../api/reports';
import { SalesByDateReportDTO } from '../../types/reports';

const VentasPorFecha: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<SalesByDateReportDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Default to last 7 days
    const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = () => {
        setIsLoading(true);
        // Append time to dates to create a full ISO 8601 string
        const startDateTime = `${startDate}T00:00:00`;
        const endDateTime = `${endDate}T23:59:59`;

        getSalesByDateReport(startDateTime, endDateTime)
            .then(response => {
                setData(response);
                setError(null);
            })
            .catch(err => {
                console.error("Failed to fetch sales by date report", err);
                setError(t('errors.unexpected'));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchReport();
    }, []); // Fetch on initial render

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReport();
    };
    
    const filterBar = (
        <Form onSubmit={handleFilter} className="d-flex gap-3 align-items-center">
            <Form.Group controlId="startDate">
                <Form.Label>{t('reports.filters.startDate')}</Form.Label>
                <Form.Control 
                    type="date" 
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="endDate">
                <Form.Label>{t('reports.filters.endDate')}</Form.Label>
                <Form.Control 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-auto">{t('reports.filters.apply')}</Button>
        </Form>
    );

    return (
        <ReportLayout title={t('reports.ventas.sub.porFecha')} filterBar={filterBar}>
            {isLoading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>{t('reports.ventas.headers.date')}</th>
                            <th className="text-end">{t('reports.ventas.headers.tickets')}</th>
                            <th className="text-end">{t('reports.ventas.headers.totalSales')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.saleDay}>
                                <td>{new Date(row.saleDay).toLocaleDateString()}</td>
                                <td className="text-end">{row.totalTickets}</td>
                                <td className="text-end">${row.totalSales.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </ReportLayout>
    );
};

export default VentasPorFecha;
