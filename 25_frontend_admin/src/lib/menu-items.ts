import { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, PieChart, FileText, Settings, AlertTriangle } from 'lucide-react';

export interface MenuItem {
    name: string;
    href: string;
    icon: LucideIcon;
    subItems?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    { name: '대시보드', href: '/', icon: LayoutDashboard },
    { name: '연령대별 분석', href: '/age-analysis', icon: Users },
    { name: '소비 분석', href: '/consumption', icon: PieChart },
    { name: '이상 거래 탐지', href: '/consumption/anomalies', icon: AlertTriangle },
    { name: '분석 요약', href: '/summary', icon: FileText },
    { name: '설정', href: '/settings', icon: Settings },
];
