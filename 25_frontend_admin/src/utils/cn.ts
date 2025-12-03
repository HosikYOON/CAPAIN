import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * 
 * clsx와 tailwind-merge를 조합하여 사용합니다:
 * - clsx: 조건부 클래스 및 다양한 형식 지원
 * - tailwind-merge: 충돌하는 Tailwind 클래스를 올바르게 병합
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // "py-1 px-4" (px-2는 px-4로 대체됨)
 * cn('text-red-500', condition && 'text-blue-500') // 조건부 클래스
 * 
 * @param inputs - 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
