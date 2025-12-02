"use client";

import { AlertTriangle, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

interface AnomalyData {
    id: number;
    category: string;
    amount: number;
    date: string;
    reason: string;
    riskLevel: '위험' | '경고' | '주의';
    status: 'pending' | 'approved' | 'rejected';
    userId: string;
    userName: string;
}

export default function AnomaliesPage() {
    const anomalies: AnomalyData[] = [
        {
            id: 1,
            category: '해외결제',
            amount: 1250000,
            date: '2024-11-29 03:45',
            reason: '평소 거래 패턴과 다름 (심야 시간 + 고액)',
            riskLevel: '위험',
            status: 'pending',
            userId: 'user_001',
            userName: '김철수'
        },
        {
            id: 2,
            category: '게임',
            amount: 55000,
            date: '2024-11-29 14:20',
            reason: '단시간 다회 결제 시도 (5분 내 3회)',
            riskLevel: '경고',
            status: 'pending',
            userId: 'user_042',
            userName: '이영희'
        },
        {
            id: 3,
            category: '편의점',
            amount: 250000,
            date: '2024-11-28 23:10',
            reason: '카테고리 평균 대비 고액 결제',
            riskLevel: '주의',
            status: 'approved',
            userId: 'user_103',
            userName: '박민수'
        },
    ];

    const pendingCount = anomalies.filter(a => a.status === 'pending').length;
    const approvedCount = anomalies.filter(a => a.status === 'approved').length;
    const rejectedCount = anomalies.filter(a => a.status === 'rejected').length;

    const getRiskColor = (level: string) => {
        switch (level) {
            case '위험': return 'bg-red-50 text-red-700 border-red-200';
            case '경고': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case '주의': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getRiskBadge = (level: string) => {
        switch (level) {
            case '위험': return 'bg-red-100 text-red-800';
            case '경고': return 'bg-yellow-100 text-yellow-800';
            case '주의': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">이상 거래 탐지</h2>
                <p className="text-gray-500 mt-1">실시간으로 감지된 이상 거래를 모니터링하고 관리합니다</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">대기 중인 알림</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{pendingCount}건</h3>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-full">
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">금일 처리 완료</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{approvedCount + rejectedCount}건</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">탐지된 위험 금액</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">₩130.5만</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
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
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${anomaly.riskLevel === '위험' ? 'bg-red-100' : anomaly.riskLevel === '경고' ? 'bg-yellow-100' : 'bg-blue-100'
                                        }`}>
                                        <AlertTriangle className={`w-6 h-6 ${anomaly.riskLevel === '위험' ? 'text-red-600' : anomaly.riskLevel === '경고' ? 'text-yellow-600' : 'text-blue-600'
                                            }`} />
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
                                    <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors">
                                        거부
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm">
                                        정상 승인
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Processed History (Compact) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">최근 처리 내역</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {anomalies.filter(a => a.status !== 'pending').map((anomaly) => (
                        <div key={anomaly.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${anomaly.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${anomaly.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
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
