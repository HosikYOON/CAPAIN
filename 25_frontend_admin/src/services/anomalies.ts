import { AnomalyData } from '@/types';

/**
 * ============================================================
 * 📌 백엔드 연동 가이드 - 이상 거래 데이터
 * ============================================================
 * 
 * 이 파일은 이상 거래 탐지 페이지의 모든 데이터와 액션을 처리합니다.
 * 
 * 📋 백엔드 API 요구사항:
 * 
 * 1. 이상 거래 목록 조회
 *    - 엔드포인트: GET /api/v1/anomalies
 *    - 쿼리 파라미터: 
 *      • status?: 'pending' | 'approved' | 'rejected' (선택)
 *      • limit?: number (선택, 기본값: 100)
 *    - 응답 형식:
 *      [
 *        {
 *          "id": 1,
 *          "category": "해외결제",
 *          "amount": 1250000,
 *          "date": "2024-11-29 03:45",
 *          "reason": "평소 거래 패턴과 다름 (심야 시간 + 고액)",
 *          "riskLevel": "위험",  // "위험", "경고", "주의" 중 하나
 *          "status": "pending",   // "pending", "approved", "rejected" 중 하나
 *          "userId": "user_001",
 *          "userName": "김철수"
 *        },
 *        // ... 더 많은 이상 거래
 *      ]
 * 
 * 2. 이상 거래 승인
 *    - 엔드포인트: POST /api/v1/anomalies/:id/approve
 *    - 요청 바디: 없음
 *    - 응답: { "success": true, "message": "승인되었습니다" }
 * 
 * 3. 이상 거래 거부
 *    - 엔드포인트: POST /api/v1/anomalies/:id/reject
 *    - 요청 바디: { "reason": "거부 사유" } (선택)
 *    - 응답: { "success": true, "message": "거부되었습니다" }
 * 
 * 4. 인증:
 *    - 모든 요청에 Authorization 헤더 필요
 *    - 형식: "Bearer {accessToken}"
 * 
 * 5. 에러 코드:
 *    - 400: 잘못된 요청
 *    - 401: 인증 실패
 *    - 403: 권한 없음 (관리자만 접근 가능)
 *    - 404: 이상 거래를 찾을 수 없음
 *    - 500: 서버 오류
 * 
 * ============================================================
 */

/**
 * 이상 거래 목록 가져오기
 * 
 * @returns Promise<AnomalyData[]> 이상 거래 목록
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (fetch 사용)
 * export async function getAnomalies(): Promise<AnomalyData[]> {
 *   const response = await fetch('/api/v1/anomalies', {
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
 * export async function getAnomalies(): Promise<AnomalyData[]> {
 *   try {
 *     const { data } = await axios.get('/api/v1/anomalies', {
 *       headers: {
 *         'Authorization': `Bearer ${getAuthToken()}`,
 *       },
 *     });
 *     return data;
 *   } catch (error) {
 *     console.error('이상 거래 데이터 로딩 실패:', error);
 *     throw error;
 *   }
 * }
 * 
 * @example
 * // ✅ 특정 상태만 조회
 * const pendingOnly = await axios.get('/api/v1/anomalies?status=pending');
 */
export async function getAnomalies(): Promise<AnomalyData[]> {
    // ⚠️ 현재: Mock 데이터 (백엔드 없이 테스트용)
    // 🔄 TODO: 위의 예시 코드로 교체하여 실제 API 연동

    // API 지연 시뮬레이션 (실제 백엔드 연동 시 제거)
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
        {
            id: 1,
            category: '해외결제',
            amount: 1250000,
            date: '2024-11-29 03:45',
            reason: '평소 거래 패턴과 다름 (심야 시간 + 고액)',
            riskLevel: '위험',
            status: 'pending',
            userId: 'user_001',
            userName: '김철수'
        },
        {
            id: 2,
            category: '게임',
            amount: 55000,
            date: '2024-11-29 14:20',
            reason: '단시간 다회 결제 시도 (5분 내 3회)',
            riskLevel: '경고',
            status: 'pending',
            userId: 'user_042',
            userName: '이영희'
        },
        {
            id: 3,
            category: '편의점',
            amount: 250000,
            date: '2024-11-28 23:10',
            reason: '카테고리 평균 대비 고액 결제',
            riskLevel: '주의',
            status: 'approved',
            userId: 'user_103',
            userName: '박민수'
        },
    ];
}

/**
 * 이상 거래 승인 처리
 * 
 * @param id - 승인할 이상 거래 ID
 * @returns Promise<void>
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (fetch 사용)
 * export async function approveAnomaly(id: number): Promise<void> {
 *   const response = await fetch(`/api/v1/anomalies/${id}/approve`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *     },
 *   });
 * 
 *   if (!response.ok) {
 *     const error = await response.json();
 *     throw new Error(error.message || '승인 처리에 실패했습니다');
 *   }
 * }
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (axios 사용, 권장)
 * import axios from 'axios';
 * 
 * export async function approveAnomaly(id: number): Promise<void> {
 *   try {
 *     await axios.post(`/api/v1/anomalies/${id}/approve`, null, {
 *       headers: {
 *         'Authorization': `Bearer ${getAuthToken()}`,
 *       },
 *     });
 *     // 성공 처리 (페이지에서 목록 새로고침)
 *   } catch (error) {
 *     console.error('이상 거래 승인 실패:', error);
 *     throw error; // 페이지에서 에러 메시지 표시
 *   }
 * }
 * 
 * @example
 * // ✅ 페이지에서 사용 예시:
 * const handleApprove = async (anomalyId: number) => {
 *   try {
 *     await approveAnomaly(anomalyId);
 *     alert('승인되었습니다');
 *     // 목록 새로고침
 *     const updatedList = await getAnomalies();
 *     setAnomalies(updatedList);
 *   } catch (error) {
 *     alert('승인 처리에 실패했습니다');
 *   }
 * };
 */
export async function approveAnomaly(id: number): Promise<void> {
    // ⚠️ 현재: Mock 함수 (백엔드 없이 테스트용)
    // 🔄 TODO: 위의 예시 코드로 교체하여 실제 API 연동

    console.log(`Approving anomaly ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * 이상 거래 거부 처리
 * 
 * @param id - 거부할 이상 거래 ID
 * @param reason - 거부 사유 (선택사항)
 * @returns Promise<void>
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (거부 사유 포함)
 * export async function rejectAnomaly(id: number, reason?: string): Promise<void> {
 *   const response = await fetch(`/api/v1/anomalies/${id}/reject`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *     },
 *     body: JSON.stringify({ reason: reason || '관리자 판단에 의한 거부' }),
 *   });
 * 
 *   if (!response.ok) {
 *     const error = await response.json();
 *     throw new Error(error.message || '거부 처리에 실패했습니다');
 *   }
 * }
 * 
 * @example
 * // ✅ 백엔드 연동 방법 (axios 사용, 권장)
 * import axios from 'axios';
 * 
 * export async function rejectAnomaly(id: number, reason?: string): Promise<void> {
 *   try {
 *     await axios.post(`/api/v1/anomalies/${id}/reject`, {
 *       reason: reason || '관리자 판단에 의한 거부',
 *     }, {
 *       headers: {
 *         'Authorization': `Bearer ${getAuthToken()}`,
 *       },
 *     });
 *   } catch (error) {
 *     console.error('이상 거래 거부 실패:', error);
 *     throw error;
 *   }
 * }
 * 
 * @example
 * // ✅ 페이지에서 사용 예시:
 * const handleReject = async (anomalyId: number) => {
 *   const reason = prompt('거부 사유를 입력하세요 (선택사항)');
 *   try {
 *     await rejectAnomaly(anomalyId, reason || undefined);
 *     alert('거부되었습니다');
 *     // 목록 새로고침
 *     const updatedList = await getAnomalies();
 *     setAnomalies(updatedList);
 *   } catch (error) {
 *     alert('거부 처리에 실패했습니다');
 *   }
 * };
 */
export async function rejectAnomaly(id: number): Promise<void> {
    // ⚠️ 현재: Mock 함수 (백엔드 없이 테스트용)
    // 🔄 TODO: 위의 예시 코드로 교체하여 실제 API 연동

    console.log(`Rejecting anomaly ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
}
