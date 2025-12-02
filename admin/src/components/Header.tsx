"use client";

import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
    '/': '대시보드',
    '/age-analysis': '연령대별 소비 분석',
    '/consumption': '소비 분석',
    '/consumption/anomalies': '이상 거래 탐지',
    '/summary': '분석 요약',
    '/settings': '설정',
};

const pageDescriptions: { [key: string]: string } = {
    '/': '전체 서비스 현황을 한눈에 확인하세요',
    '/age-analysis': '연령대별 소비 패턴과 선호 카테고리를 분석합니다',
    '/consumption': '전체적인 소비 트렌드와 카테고리별 지출을 분석합니다',
    '/consumption/anomalies': '실시간으로 감지된 이상 거래를 모니터링하고 관리합니다',
    '/summary': '지난 30일간의 주요 소비 분석 리포트입니다',
    '/settings': '시스템 설정을 관리합니다',
};

export default function Header() {
    const pathname = usePathname();
    const title = pageTitles[pathname] || '대시보드';
    const description = pageDescriptions[pathname] || '';

    return (
        <header className="bg-[#1e293b] text-white h-16 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-10 shadow-sm">
            <div>
                <div className="text-sm text-gray-400">
                    Caffeine 관리자 <span className="mx-2">/</span> {title}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-1.5 border border-gray-700">
                    <span className="text-sm text-gray-300">67%</span>
                    <button className="text-gray-400 hover:text-white">-</button>
                    <button className="text-gray-400 hover:text-white">+</button>
                    <button className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white ml-2">초기화</button>
                </div>
                <div className="flex items-center">
                    <div className="text-right mr-3">
                        <p className="text-sm font-medium text-white">관리자</p>
                        <p className="text-xs text-gray-400">admin@smartwallet.com</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
