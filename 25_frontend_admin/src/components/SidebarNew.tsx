"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { menuItems } from '@/lib/menu-items';

export default function SidebarNew() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-[#1e293b] text-white flex flex-col h-full fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-bold">Caffeine 관리자</h1>
            </div>
            <nav className="flex-1 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));

                    return (
                        <div key={item.name}>
                            <Link
                                href={item.href}
                                className={clsx(
                                    'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                                    isActive && !item.subItems
                                        ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                    isActive && item.subItems ? 'text-white' : ''
                                )}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>

                            {/* Render Sub Items */}
                            {item.subItems && (
                                <div className="bg-gray-900 border-l-4 border-indigo-500">
                                    {item.subItems.map((subItem) => {
                                        const isSubActive = pathname === subItem.href;
                                        return (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.href}
                                                className={clsx(
                                                    'flex items-center pl-14 pr-6 py-2 text-sm font-medium transition-colors',
                                                    isSubActive
                                                        ? 'text-blue-400'
                                                        : 'text-gray-500 hover:text-gray-300'
                                                )}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-70"></span>
                                                {subItem.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
