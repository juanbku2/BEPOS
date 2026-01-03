import React from 'react';
import { Link } from 'react-router-dom';
import './ReportCard.css';
// import { Lock } from 'lucide-react'; // Using lucide-react for icons, assuming it's available or can be added

interface ReportCardProps {
    title: string;
    description: string;
    linkTo: string;
    isLarge?: boolean;
    isPriority?: boolean;
    isDisabled?: boolean;
    licenseMissing?: boolean;
    isComingSoon?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
    title,
    description,
    linkTo,
    isLarge = false,
    isPriority = false,
    isDisabled = false,
    licenseMissing = false,
    isComingSoon = false,
}) => {
    const isEffectivelyDisabled = isDisabled || licenseMissing || isComingSoon;
    const cardClasses = `report-card ${isLarge ? 'large' : ''} ${isPriority ? 'priority' : ''} ${isEffectivelyDisabled ? 'disabled' : ''}`;

    const getDisabledMessage = () => {
        if (isComingSoon) return 'Próximamente...';
        if (licenseMissing) return 'No incluido en tu plan';
        return 'No tienes permiso';
    };

    const CardContent = () => (
        <>
            <h3>{title}</h3>
            <p>{description}</p>
            {isEffectivelyDisabled && (
                <div className="disabled-overlay">
                    {/* <Lock size={24} /> */}
                    <span>{getDisabledMessage()}</span>
                </div>
            )}
        </>
    );

    return isEffectivelyDisabled ? (
        <div className={cardClasses}>
            <CardContent />
        </div>
    ) : (
        <Link to={linkTo} className={cardClasses}>
            <CardContent />
        </Link>
    );
};

export default ReportCard;
