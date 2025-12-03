import { DashboardStatCardProps } from '@/types';

/**
 * 대시보드 통계 카드 컴포넌트
 * 
 * 대시보드 상단에 표시되는 주요 통계 정보 카드입니다.
 * 아이콘, 제목, 값, 증감 추세를 표시합니다.
 * 
 * @example
 * <DashboardStatCard
 *   title="전체 사용자"
 *   value="15,420"
 *   trend="+12.5% 전월 대비"
 *   icon={Users}
 *   color="text-blue-600"
 *   trendColor="text-green-500"
 * />
 */
export function DashboardStatCard({ title, value, trend, icon: Icon, color, trendColor }: DashboardStatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* 상단: 제목/값 + 아이콘 */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    {/* 카드 제목 */}
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    {/* 메인 값 */}
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
                {/* 아이콘 배경 박스 */}
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>
            {/* 하단: 증감 추세 */}
            <p className={`text-sm font-medium ${trendColor}`}>
                {trend}
            </p>
        </div>
    );
}
