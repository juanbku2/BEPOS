import React from 'react';
import { useTranslation } from 'react-i18next';
import ReportCard from './reports/ReportCard';
import './ReportsHub.css';

const ReportsHub: React.FC = () => {
    const { t } = useTranslation();

    // For now, all reports are enabled as per user feedback.
    // In a real app, this would come from a permissions/license context.
    const userPermissions = {
        canViewCorte: true,
        canViewVentas: true,
        canViewInventario: true,
        canViewCaja: true,
        canViewClientes: true,
        canViewAvanzados: true,
    };

    const moduleLicense = {
        hasAdvanced: true,
    };

    return (
        <div className="reports-hub-container">
            <div className="reports-hub-header">
                <h1>{t('reports.hub.title')}</h1>
                <p>{t('reports.hub.subtitle')}</p>
            </div>
            <div className="reports-grid">
                {/* High-priority card */}
                <ReportCard
                    title={t('reports.corte.title')}
                    description={t('reports.corte.description')}
                    linkTo="/reports/corte-caja"
                    isLarge={true}
                    isPriority={true}
                    isDisabled={!userPermissions.canViewCorte}
                />

                {/* Standard cards */}
                <ReportCard
                    title={t('reports.ventas.title')}
                    description={t('reports.ventas.description')}
                    linkTo="/reports/ventas"
                    isDisabled={!userPermissions.canViewVentas}
                />

                <ReportCard
                    title={t('reports.inventario.title')}
                    description={t('reports.inventario.description')}
                    linkTo="/reports/inventario"
                    isDisabled={!userPermissions.canViewInventario}
                />

                <ReportCard
                    title={t('reports.caja.title')}
                    description={t('reports.caja.description')}
                    linkTo="/reports/caja"
                    isDisabled={!userPermissions.canViewCaja}
                />

                {/* Disabled / Hidden example */}
                <ReportCard
                    title={t('reports.clientes.title')}
                    description={t('reports.clientes.description')}
                    linkTo="/reports/clientes"
                    isComingSoon={true} // Use a coming soon state
                />

                <ReportCard
                    title={t('reports.avanzados.title')}
                    description={t('reports.avanzados.description')}
                    linkTo="/reports/avanzados"
                    isComingSoon={true} // Use a coming soon state
                />
            </div>
        </div>
    );
};

export default ReportsHub;
