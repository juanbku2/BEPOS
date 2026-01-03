import React from 'react';
import ReportLayout from './ReportLayout';

const CajaReports: React.FC = () => {
    return (
        <ReportLayout title="Reportes de Caja" filterBar={<>Filters Here</>}>
            <div>
                <p>Reportes de caja...</p>
            </div>
        </ReportLayout>
    );
};

export default CajaReports;
