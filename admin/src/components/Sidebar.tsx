"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PieChart, FileText, Settings, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
    { name: '대시보드', href: '/', icon: LayoutDashboard },
    { name: '연령대별 분석', href: '/age-analysis', icon: Users },
    { name: '소비 분석', href: '/consumption', icon: PieChart },
    { name: '분석 요약', href: '/summary', icon: FileText },
    { name: '이상 탐지', href: '/anomalies', icon: AlertTriangle }, // Added as requested
    { name: '설정', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-[#1e293b] text-white flex flex-col h-full fixed left-0 top-0">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-bold">Caffeine 관리자</h1>
            </div>
            <nav className="flex-1 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
