import { Nav, Dropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CashRegisterControl } from './CashRegisterControl';
import './Sidebar.css';

interface SidebarProps {
    onSelect: (view: string) => void;
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
    currentView: string;
}

const Sidebar = ({ onSelect, onLogout, theme, setTheme, currentView }: SidebarProps) => {
    const { t } = useTranslation();

    const navItems = [
        { key: 'pos', icon: '🛒', label: t('dashboard.posScreen') },
        { key: 'products', icon: '📦', label: t('dashboard.products') },
        { key: 'customers', icon: '👥', label: t('dashboard.customers') },
        { key: 'reports', icon: '📈', label: t('dashboard.reports') },
        // { key: 'sales', icon: '📈', label: t('dashboard.lastSales') },
        // { key: 'users', icon: '👤', label: t('dashboard.users') },
    ];

    return (
        <div className="sidebar">
            <Nav className="flex-column">
                {navItems.map(item => (
                    <Nav.Link
                        key={item.key}
                        onClick={() => onSelect(item.key)}
                        active={currentView === item.key}
                        title={item.label} // Tooltip for accessibility
                    >
                        {item.icon}
                    </Nav.Link>
                ))}
                 <Nav.Item className="mt-auto">
                    <CashRegisterControl />
                </Nav.Item>
            </Nav>

            <div className="sidebar-footer">
                <Dropdown drop="end">
                    <Dropdown.Toggle variant="secondary" id="settings-menu" as={Button}>
                        ⚙️
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Header>{t('common.theme')}</Dropdown.Header>
                        <Dropdown.Item onClick={() => setTheme('theme-fresh')} active={theme === 'theme-fresh'}>{t('common.fresh')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => setTheme('theme-classic')} active={theme === 'theme-classic'}>{t('common.classic')}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default Sidebar;