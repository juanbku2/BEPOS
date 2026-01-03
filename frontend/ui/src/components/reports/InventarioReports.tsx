import React from 'react';
import ReportLayout from './ReportLayout';

const InventarioReports: React.FC = () => {
    return (
        <ReportLayout title="Reportes de Inventario" filterBar={<>Filters Here</>}>
            <div>
                <p>Reportes de inventario...</p>
            </div>
        </ReportLayout>
    );
};

export default InventarioReports;
