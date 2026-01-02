import { Nav, Dropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import { CashRegisterControl } from './CashRegisterControl'; // Removed, will be passed via footerContent
import './AppSidebar.css'; // Renamed CSS

interface NavItem {
    key: string;
    icon?: string; // Optional icon for generic sidebar
    label: string;
    onClick: () => void;
    active: boolean;
}

interface AppSidebarProps {
    title: string;
    bgColor: string; // Background color for the sidebar
    navItems: NavItem[];
    onLogout: () => void;
    // Props for theme switching (can be part of footerContent if generic)
    theme?: string;
    setTheme?: (theme: string) => void;
    footerContent?: React.ReactNode; // Flexible content for the footer
}

const AppSidebar = ({ title, bgColor, navItems, onLogout, theme, setTheme, footerContent }: AppSidebarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="app-sidebar" style={{ backgroundColor: bgColor }}>

            <Nav className="flex-column app-sidebar-nav">
                {navItems.map(item => (
                    <Nav.Link
                        key={item.key}
                        onClick={item.onClick}
                        active={item.active}
                        title={item.label}
                    >
                        {item.icon && <span className="me-2">{item.icon}</span>} {/* Show icon if present */}
                        {item.label}
                    </Nav.Link>
                ))}
                <hr className="text-white-50" />
                <Nav.Link onClick={() => navigate('/select-module')}>{t('common.backToModules')}</Nav.Link> {/* Now dynamic */}
                <Nav.Link onClick={onLogout}>{t('common.logout')}</Nav.Link>
            </Nav>

            <div className="app-sidebar-footer mt-auto"> {/* Footer at the bottom */}
                {footerContent ? footerContent : (
                    <> {/* Default footer if no custom content is provided */}
                        {setTheme && theme && (
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AppSidebar;