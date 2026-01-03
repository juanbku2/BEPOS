import React from 'react';
import ReportLayout from './ReportLayout';

const AvanzadosReports: React.FC = () => {
    return (
        <ReportLayout title="Reportes Avanzados" filterBar={<>Filters Here</>}>
            <div>
                <p>Reportes avanzados... (Próximamente)</p>
            </div>
        </ReportLayout>
    );
};

export default AvanzadosReports;
