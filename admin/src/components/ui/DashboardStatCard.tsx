import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
    title: string;
    value: string;
    trend: string;
    icon: LucideIcon;
    color: string;
    trendColor: string;
}

export function DashboardStatCard({ title, value, trend, icon: Icon, color, trendColor }: DashboardStatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>
            <p className={`text-sm font-medium ${trendColor}`}>
                {trend}
            </p>
        </div>
    );
}
