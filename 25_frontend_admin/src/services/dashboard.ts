import { DashboardStats } from '@/types';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

/**
 * ============================================================
 * 📌 백엔드 연동 가이드 - 대시보드 데이터
 * ============================================================
 * 
 * 이 파일은 대시보드 페이지에 필요한 모든 데이터를 제공합니다.
 * 현재는 Mock 데이터를 반환하지만, 백엔드가 준비되면 이 파일만 수정하면 됩니다.
 * 
 * 📋 백엔드 API 요구사항:
 * 
 * 1. 엔드포인트: GET /api/v1/dashboard/stats
 * 
 * 2. 응답 형식 (JSON):
 * {
 *   "stats": [
 *     {
 *       "title": "전체 사용자",
 *       "value": "15,420",
 *       "trend": "+12.5% 전월 대비",
 *       "icon": "Users",  // 아이콘 이름 (문자열)
 *       "color": "text-blue-600",
 *       "trendColor": "text-green-500"
 *     },
 *     // ... 더 많은 통계 카드 (보통 4개)
 *   ],
 *   "lineData": [
 *     { "name": "1", "value": 4000 },
 *     { "name": "2", "value": 3000 },
 *     // ... 30일치 데이터
 *   ],
 *   "barData": [
 *     { "name": "마트/편의점", "value": 4000 },
 *     { "name": "배달음식", "value": 3000 },
 *     // ... 카테고리별 데이터
 *   ],
 *   "tableData": [
 *     {
 *       "category": "마트/편의점",
 *       "amount": "₩4.2억",
 *       "count": "28,934",
 *       "ratio": "34.0%"
 *     },
 *     // ... 더 많은 카테고리
 *   ]
 * }
 * 
 * 3. 에러 처리:
 *    - 400: 잘못된 요청 → 사용자에게 알림
 *    - 401: 인증 실패 → 로그인 페이지로 리다이렉트
 *    - 500: 서버 오류 → 재시도 또는 에러 메시지 표시
 * 
 * 4. 연동 방법:
 *    아래 getDashboardData() 함수의 주석을 참고하세요.
 * 
 * ============================================================
 */

/**
 * 대시보드 통계 및 차트 데이터 가져오기
 * 
 * @returns Promise<DashboardStats> 대시보드 전체 데이터
 * 
 * @example
 * // ✅ 백엔드 연동 방법 1: fetch 사용
 * export async function getDashboardData(): Promise<DashboardStats> {
 *   const response = await fetch('/api/v1/dashboard/stats', {
 *     method: 'GET',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`, // 인증 토큰 추가
 *     },
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error(`HTTP error! status: ${response.status}`);
 *   }
 * 
 *   const data = await response.json();
 *   
 *   // 아이콘 매핑 (백엔드는 문자열로 전달, 프론트엔드는 컴포넌트로 변환)
 *   const iconMap = {
 *     'Users': Users,
 *     'ShoppingCart': ShoppingCart,
 *     'DollarSign': DollarSign,
 *     'TrendingUp': TrendingUp,
 *   };
 *   
 *   data.stats = data.stats.map(stat => ({
 *     ...stat,
 *     icon: iconMap[stat.icon] || Users, // 기본값: Users
 *   }));
 * 
 *   return data;
 * }
 * 
 * @example
 * // ✅ 백엔드 연동 방법 2: axios 사용 (권장)
 * import axios from 'axios';
 * 
 * export async function getDashboardData(): Promise<DashboardStats> {
 *   try {
 *     const { data } = await axios.get('/api/v1/dashboard/stats', {
 *       headers: {
 *         'Authorization': `Bearer ${getAuthToken()}`,
 *       },
 *     });
 * 
 *     // 아이콘 매핑
 *     const iconMap = { 'Users': Users, 'ShoppingCart': ShoppingCart, ... };
 *     data.stats = data.stats.map(stat => ({
 *       ...stat,
 *       icon: iconMap[stat.icon] || Users,
 *     }));
 * 
 *     return data;
 *   } catch (error) {
 *     console.error('대시보드 데이터 로딩 실패:', error);
 *     throw error; // 페이지에서 에러 처리
 *   }
 * }
 */
export async function getDashboardData(): Promise<DashboardStats> {
    // ⚠️ 현재: Mock 데이터 (백엔드 없이 테스트용)
    // 🔄 TODO: 위의 예시 코드로 교체하여 실제 API 연동

    // API 지연 시뮬레이션 (실제 백엔드 연동 시 제거)
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
        // 상단 4개 통계 카드 데이터
        stats: [
            { title: '전체 사용자', value: '15,420', trend: '+12.5% 전월 대비', icon: Users, color: 'text-blue-600', trendColor: 'text-green-500' },
            { title: '총 거래 건수', value: '89,234', trend: '+8.2% 전월 대비', icon: ShoppingCart, color: 'text-blue-600', trendColor: 'text-green-500' },
            { title: '총 거래액', value: '₩12.5억', trend: '+15.3% 전월 대비', icon: DollarSign, color: 'text-blue-600', trendColor: 'text-green-500' },
            { title: '평균 거래액', value: '₩1.4만', trend: '▼ 3.1% 전월 대비', icon: TrendingUp, color: 'text-blue-600', trendColor: 'text-red-500' },
        ],

        // 일별 거래 추이 차트 데이터 (라인 차트)
        lineData: [
            { name: '1', value: 4000 }, { name: '2', value: 3000 }, { name: '3', value: 2000 }, { name: '4', value: 2780 },
            { name: '5', value: 1890 }, { name: '6', value: 2390 }, { name: '7', value: 3490 }, { name: '8', value: 4000 },
            { name: '9', value: 3000 }, { name: '10', value: 2000 }, { name: '11', value: 2780 }, { name: '12', value: 1890 },
            { name: '13', value: 2390 }, { name: '14', value: 3490 }, { name: '15', value: 4200 }, { name: '16', value: 3800 },
            { name: '17', value: 3500 }, { name: '18', value: 3000 }, { name: '19', value: 2500 }, { name: '20', value: 2800 },
            { name: '21', value: 3200 }, { name: '22', value: 3600 }, { name: '23', value: 4000 }, { name: '24', value: 4500 },
            { name: '25', value: 4800 }, { name: '26', value: 4600 }, { name: '27', value: 4200 }, { name: '28', value: 3800 },
            { name: '29', value: 3500 }, { name: '30', value: 3200 },
        ],

        // 카테고리별 소비 차트 데이터 (바 차트)
        barData: [
            { name: '마트/편의점', value: 4000 },
            { name: '배달음식', value: 3000 },
            { name: '카페/디저트', value: 2000 },
            { name: '교육', value: 1800 },
            { name: '패션/뷰티', value: 1500 },
            { name: '주유', value: 1200 },
            { name: '기타', value: 800 },
        ],

        // 카테고리 상세 테이블 데이터
        tableData: [
            { category: '마트/편의점', amount: '₩4.2억', count: '28,934', ratio: '34.0%' },
            { category: '배달음식', amount: '₩3억', count: '15,678', ratio: '23.9%' },
            { category: '카페/디저트', amount: '₩1.6억', count: '12,456', ratio: '12.6%' },
            { category: '교육', amount: '₩1.3억', count: '8,234', ratio: '10.3%' },
            { category: '패션/뷰티', amount: '₩9823.5만', count: '6,789', ratio: '7.9%' },
            { category: '주유', amount: '₩8923.5만', count: '5,234', ratio: '7.1%' },
            { category: '기타', amount: '₩4505만', count: '11,909', ratio: '3.6%' },
        ],
    };
}
