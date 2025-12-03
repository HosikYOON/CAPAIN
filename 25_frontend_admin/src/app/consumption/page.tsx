"use client";

import { useState, useEffect } from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { ConsumptionItem } from '@/components/ui/ConsumptionItem';
import { getConsumptionSummary } from '@/services/consumption';
import { ConsumptionItemData } from '@/types';

// [왕초보 백엔드 연동 가이드]
// 1. services/consumption.ts 파일을 열어서 getConsumptionSummary() 함수를 수정하세요
// 2. 현재는 mock 데이터를 반환하지만, 실제 API 호출로 변경하면 됩니다
// 3. 예시:
//    const response = await fetch('/api/v1/consumption/summary');
//    const data = await response.json();
//    return data;

export default function ConsumptionPage() {
    const [consumptionData, setConsumptionData] = useState<ConsumptionItemData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getConsumptionSummary();
                setConsumptionData(data.items);
            } catch (error) {
                console.error('소비 데이터를 가져오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">소비 분석</h2>
                <p className="text-gray-500 mt-1">전체적인 소비 트렌드를 분석합니다</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">월간 소비 요약</h3>
                        <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-400">소비 차트가 여기에 표시됩니다</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">주요 지출 카테고리</h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-gray-400 text-center">로딩 중...</p>
                        ) : (
                            consumptionData.map((item, i) => (
                                <ConsumptionItem
                                    key={i}
                                    name={item.name}
                                    amount={item.amount}
                                    percent={item.percent}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
