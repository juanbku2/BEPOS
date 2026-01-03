import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './ReportLayout.css';

interface ReportLayoutProps {
    title: string;
    children: React.ReactNode;
    filterBar: React.ReactNode;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({ title, children, filterBar }) => {
    const navigate = useNavigate();

    return (
        <div className="report-layout">
            <div className="report-header">
                <h2>{title}</h2>
                <Button variant="outline-secondary" onClick={() => navigate('/reports')}>
                    &larr; Volver a Reportes
                </Button>
            </div>

            <div className="report-filter-bar">
                {filterBar}
            </div>

            <div className="report-content">
                {children}
            </div>

            <div className="report-footer">
                <Button variant="secondary" disabled>Exportar PDF</Button>
                <Button variant="secondary" disabled>Exportar CSV</Button>
            </div>
        </div>
    );
};

export default ReportLayout;
