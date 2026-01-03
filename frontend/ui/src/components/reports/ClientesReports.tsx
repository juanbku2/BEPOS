import React from 'react';
import ReportLayout from './ReportLayout';

const ClientesReports: React.FC = () => {
    return (
        <ReportLayout title="Reportes de Clientes" filterBar={<>Filters Here</>}>
            <div>
                <p>Reportes de clientes... (Próximamente)</p>
            </div>
        </ReportLayout>
    );
};

export default ClientesReports;
