export interface NavItem {
    key: string;
    icon?: string;
    label: string;
    onClick: () => void;
    active: boolean;
}
