import { RiskLevel } from '@/types';

/**
 * 위험 수준에 맞는 배지 스타일 클래스 반환
 * 
 * 위험 수준에 따라 적절한 배경색과 텍스트 색상 조합을 반환합니다.
 * 
 * @example
 * getRiskBadge('위험') // "bg-red-100 text-red-800"
 * getRiskBadge('경고') // "bg-yellow-100 text-yellow-800"
 * 
 * @param level - 위험 수준 ('위험', '경고', '주의')
 * @returns Tailwind CSS 클래스 문자열
 */
export function getRiskBadge(level: RiskLevel): string {
    switch (level) {
        case '위험':
            return 'bg-red-100 text-red-800';
        case '경고':
            return 'bg-yellow-100 text-yellow-800';
        case '주의':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

/**
 * 위험 수준에 맞는 아이콘 배경 색상 클래스 반환
 * 
 * @example
 * getRiskIconBg('위험') // "bg-red-100"
 * 
 * @param level - 위험 수준 ('위험', '경고', '주의')
 * @returns Tailwind CSS 배경 색상 클래스
 */
export function getRiskIconBg(level: RiskLevel): string {
    switch (level) {
        case '위험':
            return 'bg-red-100';
        case '경고':
            return 'bg-yellow-100';
        case '주의':
            return 'bg-blue-100';
        default:
            return 'bg-gray-100';
    }
}

/**
 * 위험 수준에 맞는 아이콘 색상 클래스 반환
 * 
 * @example
 * getRiskIconColor('위험') // "text-red-600"
 * 
 * @param level - 위험 수준 ('위험', '경고', '주의')
 * @returns Tailwind CSS 텍스트 색상 클래스
 */
export function getRiskIconColor(level: RiskLevel): string {
    switch (level) {
        case '위험':
            return 'text-red-600';
        case '경고':
            return 'text-yellow-600';
        case '주의':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
}
