/**
 * 숫자를 한국 원화 형식으로 포맷팅
 * 
 * 큰 금액은 자동으로 억, 만 단위로 변환합니다.
 * 
 * @example
 * formatCurrency(150000000) // "₩1.5억"
 * formatCurrency(45000) // "₩4.5만"
 * formatCurrency(5000) // "₩5,000"
 * 
 * @param amount - 포맷팅할 금액 (숫자)
 * @returns 포맷된 금액 문자열
 */
export function formatCurrency(amount: number): string {
    if (amount >= 100000000) {
        // 1억 이상은 억 단위로 표시
        return `₩${(amount / 100000000).toFixed(1)}억`;
    }
    if (amount >= 10000) {
        // 1만 이상은 만 단위로 표시
        return `₩${(amount / 10000).toFixed(1)}만`;
    }
    // 1만 미만은 천 단위 구분 쉼표 사용
    return `₩${amount.toLocaleString()}`;
}

/**
 * 숫자를 한국 로케일 형식으로 포맷팅
 * 
 * 천 단위마다 쉼표를 추가합니다.
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 * 
 * @param num - 포맷팅할 숫자
 * @returns 포맷된 숫자 문자열
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('ko-KR');
}

/**
 * 날짜 문자열을 한국 형식으로 포맷팅
 * 
 * 연-월-일 형식으로 변환합니다.
 * 
 * @example
 * formatDate('2024-11-29') // "2024. 11. 29."
 * 
 * @param dateString - 포맷팅할 날짜 문자열
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * 날짜시간 문자열을 한국 형식으로 포맷팅
 * 
 * 연-월-일 시:분 형식으로 변환합니다.
 * 
 * @example
 * formatDateTime('2024-11-29 03:45') // "2024. 11. 29. 오전 3:45"
 * 
 * @param dateString - 포맷팅할 날짜시간 문자열
 * @returns 포맷된 날짜시간 문자열
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
