/**
 * 소비 항목 데이터
 * ConsumptionItem 컴포넌트에서 표시되는 개별 소비 카테고리 정보입니다.
 */
export interface ConsumptionItemData {
    /** 카테고리 이름 (예: "식비", "쇼핑", "교통") */
    name: string;

    /** 소비 금액 (포맷된 문자열, 예: "₩450,000") */
    amount: string;

    /** 전체 대비 비율 (CSS width 값으로 사용, 예: "35%") */
    percent: string;
}

/**
 * 소비 요약 데이터
 * getConsumptionSummary() 서비스 함수가 반환하는 데이터 형식입니다.
 */
export interface ConsumptionSummary {
    /** 주요 지출 카테고리 배열 */
    items: ConsumptionItemData[];
}
