import { LucideIcon } from 'lucide-react';

/**
 * 이상 거래 상태
 * pending: 검토 대기, approved: 정상 승인됨, rejected: 거부됨
 */
export type AnomalyStatus = 'pending' | 'approved' | 'rejected';

/**
 * 위험 수준
 * 위험 정도에 따른 3단계 분류입니다.
 */
export type RiskLevel = '위험' | '경고' | '주의';

/**
 * 이상 거래 데이터
 * 감지된 이상 거래의 상세 정보를 담는 인터페이스입니다.
 */
export interface AnomalyData {
    /** 고유 ID */
    id: number;

    /** 거래 카테고리 (예: "해외결제", "게임", "편의점") */
    category: string;

    /** 거래 금액 (숫자, 예: 1250000) */
    amount: number;

    /** 거래 일시 (문자열, 예: "2024-11-29 03:45") */
    date: string;

    /** 이상 거래로 판단된 사유 */
    reason: string;

    /** 위험 수준 ("위험", "경고", "주의" 중 하나) */
    riskLevel: RiskLevel;

    /** 처리 상태 ("pending", "approved", "rejected" 중 하나) */
    status: AnomalyStatus;

    /** 사용자 ID */
    userId: string;

    /** 사용자 이름 */
    userName: string;
}

/**
 * 이상 거래 요약 카드 Props
 * AnomalySummaryCard 컴포넌트에 전달되는 속성들을 정의합니다.
 */
export interface AnomalySummaryCardProps {
    /** 카드 제목 (예: "대기 중인 알림") */
    title: string;

    /** 표시할 값 (예: "2건") */
    value: string;

    /** Lucide React 아이콘 컴포넌트 */
    icon: LucideIcon;

    /** 아이콘의 Tailwind 색상 클래스 (예: "text-yellow-600") */
    iconColor: string;

    /** 아이콘 배경의 Tailwind 색상 클래스 (예: "bg-yellow-50") */
    iconBgColor: string;
}
