import { AnomalySummaryCardProps } from '@/types';

/**
 * 이상 거래 요약 카드 컴포넌트
 * 
 * 이상 거래 페이지 상단에 표시되는 요약 정보 카드입니다.
 * DashboardStatCard와 유사하지만 추세 정보가 없습니다.
 * 
 * @example
 * <AnomalySummaryCard
 *   title="대기 중인 알림"
 *   value="2건"
 *   icon={Clock}
 *   iconColor="text-yellow-600"
 *   iconBgColor="bg-yellow-50"
 * />
 */
export function AnomalySummaryCard({ title, value, icon: Icon, iconColor, iconBgColor }: AnomalySummaryCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    {/* 카드 제목 */}
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    {/* 메인 값 */}
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
                {/* 아이콘 (동적 배경색) */}
                <div className={`p-2 ${iconBgColor} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
