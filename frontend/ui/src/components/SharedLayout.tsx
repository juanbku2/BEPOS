import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { NavItem } from '../types/NavItem'; // I'll need to create this type

interface SharedLayoutProps {
    navItems: NavItem[];
    sidebarBgColor: string;
    sidebarFooter?: React.ReactNode;
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const SharedLayout: React.FC<SharedLayoutProps> = (props) => {
    return (
        <>
            <AppSidebar
                title=""
                bgColor={props.sidebarBgColor}
                navItems={props.navItems}
                onLogout={props.onLogout}
                theme={props.theme}
                setTheme={props.setTheme}
                footerContent={props.sidebarFooter}
            />
            <div className="content">
                <Outlet />
            </div>
        </>
    );
};

export default SharedLayout;
