import { LucideIcon } from 'lucide-react';

/**
 * 대시보드 통계 카드 Props
 * DashboardStatCard 컴포넌트에 전달되는 속성들을 정의합니다.
 */
export interface DashboardStatCardProps {
    /** 카드 제목 (예: "전체 사용자") */
    title: string;

    /** 표시할 주요 값 (예: "15,420") */
    value: string;

    /** 증감 추세 텍스트 (예: "+12.5% 전월 대비") */
    trend: string;

    /** Lucide React 아이콘 컴포넌트 */
    icon: LucideIcon;

    /** 아이콘의 Tailwind 색상 클래스 (예: "text-blue-600") */
    color: string;

    /** 추세 텍스트의 Tailwind 색상 클래스 (예: "text-green-500" 또는 "text-red-500") */
    trendColor: string;
}

/**
 * 차트 데이터 포인트
 * Recharts 라이브러리에서 사용하는 데이터 형식입니다.
 */
export interface ChartDataPoint {
    /** X축 레이블 (예: "1", "2", "3"...) */
    name: string;

    /** Y축 값 (숫자 데이터) */
    value: number;
}

/**
 * 카테고리 테이블 행 데이터
 * CategoryTable 컴포넌트에서 표시되는 각 카테고리의 정보입니다.
 */
export interface CategoryData {
    /** 카테고리 이름 (예: "마트/편의점", "배달음식") */
    category: string;

    /** 거래액 (포맷된 문자열, 예: "₩4.2억") */
    amount: string;

    /** 거래 건수 (포맷된 문자열, 예: "28,934") */
    count: string;

    /** 전체 대비 비율 (예: "34.0%") */
    ratio: string;
}

/**
 * 대시보드 전체 데이터 구조
 * getDashboardData() 서비스 함수가 반환하는 데이터 형식입니다.
 */
export interface DashboardStats {
    /** 상단 통계 카드 배열 (일반적으로 4개) */
    stats: DashboardStatCardProps[];

    /** 일별 거래 추이 차트 데이터 */
    lineData: ChartDataPoint[];

    /** 카테고리별 소비 차트 데이터 */
    barData: ChartDataPoint[];

    /** 카테고리 상세 테이블 데이터 */
    tableData: CategoryData[];
}
