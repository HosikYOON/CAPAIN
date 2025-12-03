import { ConsumptionSummary } from '@/types';

/**
 * ============================================================
 * 📌 백엔드 연동 가이드 - 소비 분석 데이터
 * ============================================================
 * 
 * 이 파일은 소비 분석 페이지의 데이터를 제공합니다.
 * 
 * 📋 백엔드 API 요구사항:
 * 
 * 1. 소비 요약 데이터 조회
 *    - 엔드포인트: GET /api/v1/consumption/summary
 *    - 쿼리 파라미터:
 *      • period?: 'week' | 'month' | 'year' (선택, 기본값: 'month')
 *      • userId?: string (선택, 특정 사용자 조회)
 *    - 응답 형식:
 *      {
 *        "items": [
 *          {
 *            "name": "식비",
 *            "amount": "₩450,000",    // 포맷된 문자열
 *            "percent": "35%"         // CSS width 값으로 사용
 *          },
 *          {
 *            "name": "쇼핑",
 *            "amount": "₩320,000",
 *            "percent": "25%"
 *          },
 *          // ... 더 많은 카테고리 (보통 5-7개)
 *        ]
 *      }
 * 
 * 2. 인증:
 *    - Authorization 헤더 필요: "Bearer {accessToken}"
 * 
 * 3. 에러 처리:
 *    - 400: 잘못된 요청 (잘못된 period 값 등)
 *    - 401: 인증 실패
 *    - 404: 데이터 없음 (신규 사용자 등)
 *    - 500: 서버 오류
 * 
 * 4. 참고사항:
 *    - amount는 이미 포맷된 문자열로 전달 (₩ 기호 포함)
 *    - percent는 CSS width로 사용되므로 "%" 기호 포함 필수
 *    - items는 금액 내림차순으로 정렬되어야 함
 * 
 * ============================================================
 */

/**
 * 소비 요약 데이터 가져오기
 * 
 * @param period - 조회 기간 ('week', 'month', 'year')
 * @returns Promise<ConsumptionSummary> 주요 지출 카테고리 데이터
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (기본 - 월간 데이터)
 * export async function getConsumptionSummary(): Promise<ConsumptionSummary> {
 *   const response = await fetch('/api/v1/consumption/summary', {
 *     method: 'GET',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *     },
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error(`HTTP error! status: ${response.status}`);
 *   }
 * 
 *   return await response.json();
 * }
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (axios 사용, 권장)
 * import axios from 'axios';
 * 
 * export async function getConsumptionSummary(
 *   period: 'week' | 'month' | 'year' = 'month'
 * ): Promise<ConsumptionSummary> {
 *   try {
 *     const { data } = await axios.get('/api/v1/consumption/summary', {
 *       params: { period }, // 쿼리 파라미터로 전달
 *       headers: {
 *         'Authorization': `Bearer ${getAuthToken()}`,
 *       },
 *     });
 *     return data;
 *   } catch (error) {
 *     console.error('소비 데이터 로딩 실패:', error);
 *     
 *     // 404 에러의 경우 빈 배열 반환 (신규 사용자)
 *     if (axios.isAxiosError(error) && error.response?.status === 404) {
 *       return { items: [] };
 *     }
 *     
 *     throw error;
 *   }
 * }
 * 
 * @example
 * // ✅ 페이지에서 사용 예시:
 * const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
 * const [data, setData] = useState<ConsumptionItemData[]>([]);
 * 
 * useEffect(() => {
 *   const fetchData = async () => {
 *     const summary = await getConsumptionSummary(period);
 *     setData(summary.items);
 *   };
 *   fetchData();
 * }, [period]);
 * 
 * @example
 * // ✅ 특정 사용자 데이터 조회 (관리자용)
 * const { data } = await axios.get('/api/v1/consumption/summary', {
 *   params: { userId: 'user_001', period: 'month' },
 * });
 */
export async function getConsumptionSummary(): Promise<ConsumptionSummary> {
    // ⚠️ 현재: Mock 데이터 (백엔드 없이 테스트용)
    // 🔄 TODO: 위의 예시 코드로 교체하여 실제 API 연동

    // API 지연 시뮬레이션 (실제 백엔드 연동 시 제거)
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
        items: [
            { name: '식비', amount: '₩450,000', percent: '35%' },
            { name: '쇼핑', amount: '₩320,000', percent: '25%' },
            { name: '교통', amount: '₩150,000', percent: '12%' },
        ],
    };
}
