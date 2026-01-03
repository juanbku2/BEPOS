import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import VentasPorFecha from './VentasPorFecha';
import VentasPorProducto from './VentasPorProducto';
import VentasPorCajero from './VentasPorCajero';
import VentasPorFormaDePago from './VentasPorFormaDePago';
import './VentasReports.css';

const VentasReports: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSelect = (key: string | null) => {
        if (key) {
            navigate(`/reports/ventas/${key}`);
        }
    };
    
    // Determine active key from path. Example: /reports/ventas/por-fecha -> por-fecha
    const activeKey = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

    return (
        <div className="ventas-reports-container">
            <Tabs
                id="sales-reports-tabs"
                activeKey={activeKey}
                onSelect={handleSelect}
                className="mb-3 ventas-tabs"
            >
                <Tab eventKey="por-fecha" title={t('reports.ventas.sub.porFecha')} />
                <Tab eventKey="por-producto" title={t('reports.ventas.sub.porProducto')} />
                <Tab eventKey="por-cajero" title={t('reports.ventas.sub.porCajero')} />
                <Tab eventKey="por-forma-pago" title={t('reports.ventas.sub.porFormaDePago')} />
            </Tabs>

            <div className="ventas-reports-content">
                <Routes>
                    <Route path="por-fecha" element={<VentasPorFecha />} />
                    <Route path="por-producto" element={<VentasPorProducto />} />
                    <Route path="por-cajero" element={<VentasPorCajero />} />
                    <Route path="por-forma-pago" element={<VentasPorFormaDePago />} />
                    {/* Default route for /reports/ventas */}
                    <Route index element={<Navigate to="por-fecha" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default VentasReports;
