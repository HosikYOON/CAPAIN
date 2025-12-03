"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { AnomalyData } from '@/types';
import { AnomalySummaryCard } from '@/components/ui/AnomalySummaryCard';
import { getAnomalies } from '@/services/anomalies';
import { getRiskBadge, getRiskIconBg, getRiskIconColor } from '@/utils/anomaly';

// [왕초보 백엔드 연동 가이드]
// 1. services/anomalies.ts 파일을 열어서 getAnomalies() 함수를 수정하세요
// 2. 현재는 mock 데이터를 반환하지만, 실제 API 호출로 변경하면 됩니다
// 3. 예시:
//    const response = await fetch('/api/v1/anomalies');
//    const data = await response.json();
//    return data;

export default function AnomaliesPage() {
    const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAnomalies();
                setAnomalies(data);
            } catch (error) {
                console.error('이상 거래 데이터를 가져오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-64">로딩 중...</div>;
    }

    const pendingCount = anomalies.filter(a => a.status === 'pending').length;
    const approvedCount = anomalies.filter(a => a.status === 'approved').length;
    const rejectedCount = anomalies.filter(a => a.status === 'rejected').length;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">이상 거래 탐지</h2>
                <p className="text-gray-500 mt-1">실시간으로 감지된 이상 거래를 모니터링하고 관리합니다</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnomalySummaryCard
                    title="대기 중인 알림"
                    value={`${pendingCount}건`}
                    icon={Clock}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-50"
                />
                <AnomalySummaryCard
                    title="금일 처리 완료"
                    value={`${approvedCount + rejectedCount}건`}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
                <AnomalySummaryCard
                    title="탐지된 위험 금액"
                    value="₩130.5만"
                    icon={AlertTriangle}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-50"
                />
            </div>

            {/* Pending Anomalies List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">대기 중인 이상 거래</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {pendingCount}건의 검토 필요 항목
                    </span>
                </div>
                <div className="divide-y divide-gray-100">
                    {anomalies.filter(a => a.status === 'pending').map((anomaly) => (
                        <div key={anomaly.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getRiskIconBg(anomaly.riskLevel)}`}>
                                        <AlertTriangle className={`w-6 h-6 ${getRiskIconColor(anomaly.riskLevel)}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskBadge(anomaly.riskLevel)}`}>
                                                {anomaly.riskLevel}
                                            </span>
                                            <h4 className="text-base font-bold text-gray-800">{anomaly.category}</h4>
                                            <span className="text-sm text-gray-500">• {anomaly.date}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">₩{anomaly.amount.toLocaleString()}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                            <span className="font-medium">의심 사유:</span>
                                            {anomaly.reason}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            사용자: <span className="font-medium text-gray-700">{anomaly.userName}</span> ({anomaly.userId})
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                                        상세 보기
                                    </button>
                                    {/* [왕초보 가이드] 거부 버튼 기능 구현하기
                                        1. onClick 이벤트를 추가해서 백엔드로 요청을 보내야 합니다.
                                        예시:
                                        <button onClick={async () => {
                                            await fetch(`/api/v1/anomalies/${anomaly.id}/reject`, { method: 'POST' });
                                            // 성공 후 목록 새로고침 필요
                                        }} ... >
                                    */}
                                    <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors">
                                        거부
                                    </button>
                                    {/* [왕초보 가이드] 승인 버튼 기능 구현하기
                                        1. onClick 이벤트를 추가해서 백엔드로 요청을 보내야 합니다.
                                        예시:
                                        <button onClick={async () => {
                                            await fetch(`/api/v1/anomalies/${anomaly.id}/approve`, { method: 'POST' });
                                            // 성공 후 목록 새로고침 필요
                                        }} ... >
                                    */}
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm">
                                        정상 승인
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Processed History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">최근 처리 내역</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {anomalies.filter(a => a.status !== 'pending').map((anomaly) => (
                        <div key={anomaly.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${anomaly.status === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {anomaly.status === 'approved' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{anomaly.category} - ₩{anomaly.amount.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{anomaly.date} • {anomaly.userName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${anomaly.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {anomaly.status === 'approved' ? '정상 승인됨' : '거부됨'}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
