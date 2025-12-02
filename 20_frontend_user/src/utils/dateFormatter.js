/**
 * 날짜 포맷팅 유틸리티 함수
 * 
 * 앱 전체에서 사용하는 날짜 관련 함수 모음
 */

/**
 * 상대적 날짜 표시 ("오늘", "어제", "3일 전" 등)
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} 상대적 날짜 표현
 */
export const getRelativeDate = (date) => {
    const targetDate = new Date(date);
    const today = new Date();

    // 시간 부분 제거 (날짜만 비교)
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = today - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays === 2) return '그저께';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
};

/**
 * 날짜를 "YYYY-MM-DD HH:mm" 형식으로 포맷
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 날짜를 "YYYY-MM-DD" 형식으로 포맷
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * 날짜를 "MM월 DD일" 형식으로 포맷
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDateKorean = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${month}월 ${day}일`;
};

/**
 * ISO 날짜를 "YYYY-MM" 형식으로 변환
 * 예: "2024-06-01" → "2024-06"
 * @param {string} isoDate - ISO 형식 날짜 문자열
 * @returns {string} "YYYY-MM" 형식 문자열
 */
export const formatMonthFromISO = (isoDate) => {
    return isoDate.substring(0, 7);
};

/**
 * "YYYY-MM" 형식을 "MM월"로 변환
 * 예: "2024-06" → "6월"
 * @param {string} yearMonth - "YYYY-MM" 형식 문자열
 * @returns {string} "MM월" 형식 문자열
 */
export const formatMonthLabel = (yearMonth) => {
    const month = yearMonth.split('-')[1];
    return `${parseInt(month, 10)}월`;
};

/**
 * 두 날짜 사이의 일수 계산
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜
 * @returns {number} 일수 차이
 */
export const getDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * 만료일까지 남은 일수 계산
 * @param {string|Date} expiryDate - 만료일
 * @returns {number} 남은 일수 (음수면 0 반환)
 */
export const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
};
