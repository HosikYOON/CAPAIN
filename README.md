# ☕ Caffeine - AI 기반 스마트 금융 관리 앱

> **상태**: 프론트엔드 개발 완료 ✅ | 백엔드 연결 준비 완료 🔌  
> **최종 업데이트**: 2024-12-02  
> **버전**: 1.4.0

React Native + Expo 기반 스마트 금융 관리 애플리케이션으로, AI 예측 기능과 이상거래 탐지를 제공합니다.

---

## 🚀 빠른 시작

### 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

**웹 브라우저**: `http://localhost:19006` 에서 확인  
**모바일**: Expo Go 앱에서 QR 코드 스캔

---

## 📁 프로젝트 구조

```
caffeine-app/
├── admin/                 # Next.js 관리자 웹 대시보드
│   ├── src/
│   │   ├── app/           # 페이지 (Next.js App Router)
│   │   ├── components/    # UI 컴포넌트
│   │   └── types/         # TypeScript 타입 정의
│   └── package.json
│
├── frontend/              # React Native 프론트엔드
│   ├── src/
│   │   ├── screens/       # 화면 컴포넌트
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── contexts/      # Context API (인증, 테마)
│   │   ├── utils/         # 유틸리티 함수
│   │   └── constants/     # 상수
│   ├── assets/            # 이미지, 폰트
│   ├── App.js            # 메인 앱
│   └── package.json
│
├── backend/              # 백엔드 (향후 추가 예정)
├── .github/workflows/    # CI/CD
└── README.md
```

---

## ✨ 주요 기능

### 🔐 인증 & 사용자 관리
- ✅ 로그인 / 회원가입 (Mock)
- ✅ 다크모드 지원
- ✅ 프로필 설정

### 📊 대시보드
- ✅ 실시간 소비 요약 (총 지출, 거래 건수, 평균 거래액)
- ✅ 월별 지출 추이 차트 (LineChart)
- ✅ 카테고리별 소비 분석 (프로그레스 바)
- ✅ AI 인사이트 제공
- ✅ **NEW!** AI 예측 광고 배너 (ML 모델 연동 준비)

### 💳 거래내역 관리
- ✅ 전체 거래내역 조회
- ✅ 실시간 검색 (가맹점, 카테고리, 메모)
- ✅ 거래 상세 정보 모달
- ✅ 메모 추가/수정
- ✅ **NEW!** 이상거래 범주 선택 (🟢안전/🟡의심/🔴위험)
- ✅ **NEW!** 고객센터 신고 기능

### 🔍 이상거래 탐지 (AI)
- ✅ ML 모델 기반 이상거래 자동 탐지
- ✅ 위험도 등급 (높음/중간/낮음)
- ✅ 의심 이유 상세 설명
- ✅ 정상 거래 표시
- ✅ 카드 정지 요청

### 🎯 AI 예측 기능
- ✅ 다음 구매 예측 (가맹점, 금액, 시간)
- ✅ 맞춤형 쿠폰 발급
- ✅ 예측 신뢰도 표시 (%)
- ✅ 실시간 배너 광고

### 🎁 쿠폰함 (NEW!)
- ✅ **전용 쿠폰함 탭** - 5번째 탭으로 추가
- ✅ **가맹점 검색** - 실시간 쿠폰 검색
- ✅ **카테고리 필터** - 전체/식비/쇼핑/편의점/여가/만료
- ✅ **3단계 섹션 구분**:
  - ⏰ **곧 만료** - 7일 이내 만료 쿠폰 (노란색 강조)
  - ✨ **사용 가능** - 일반 사용 가능 쿠폰 (초록색)
  - 📦 **사용완료/만료** - 접기/펼치기 가능
- ✅ **상세 쿠폰 카드** - 가맹점, 할인금액, 최소구매, 만료일
- ✅ **배너 광고 연동** - 대시보드 배너에서 쿠폰 받기
- ✅ Mock 데이터 (6개 쿠폰)

### 🖥️ 관리자 대시보드 (Web)
- ✅ **Next.js 기반** 웹 애플리케이션
- ✅ **대시보드 개요**: 전체 사용자, 거래 건수, 거래액 등 핵심 지표 시각화
- ✅ **소비 분석**: 카테고리별 지출 현황 및 트렌드 분석
- ✅ **이상 거래 탐지**:
  - 실시간 이상 거래 모니터링
  - 위험도별(위험/경고/주의) 시각화
  - 승인/거부 처리 액션
- ✅ **왕초보 백엔드 연동 가이드**:
  - 각 페이지별 `fetch` API 연동 예시 코드 제공
  - `useState`, `useEffect`를 활용한 데이터 바인딩 가이드
  - 초보자 친화적인 주석 설명 (삭제할 부분 vs 추가할 부분 명시)
- ✅ **컴포넌트 기반 아키텍처**:
  - 재사용 가능한 UI 컴포넌트 (`DashboardStatCard`, `AnomalySummaryCard` 등)
  - TypeScript 타입 정의 분리 (`types/index.ts`)

---

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일/웹 모두 지원
- **다크모드**: 테마 자동 전환
- **스켈레톤 로딩**: 데이터 로딩 중 UX 개선
- **애니메이션**: FadeIn, CountUp 등 부드러운 전환
- **EmptyState**: 빈 데이터 상태 안내
- **Pull-to-Refresh**: 데이터 새로고침

---

## 🔴 백엔드 연결 가이드

### Mock 데이터 위치

모든 화면에 **TODO 주석**이 추가되어 있습니다. `Ctrl+F`로 `TODO: 백엔드`를 검색하세요.

#### 주요 파일:

1. **DashboardScreen.js** 
   - `MOCK_DATA` (라인 12-37)
   - `loadData()` 함수 수정 필요
   - API: `/api/dashboard/summary`, `/api/predictions/next`

2. **TransactionScreen.js**
   - `MOCK_TRANSACTIONS` (라인 8-47)
   - `handleCategorySelect()` 함수 수정 필요
   - API: `/api/transactions`, `/api/transactions/{id}/anomaly`

3. **AnomalyDetectionScreen.js**
   - `MOCK_ANOMALIES` (라인 8-42)
   - `handleMarkAsNormal()`, `handleBlockCard()` 수정 필요
   - API: `/api/anomalies`, `/api/anomalies/{id}/mark-normal`

4. **CouponScreen.js** (NEW!)
   - `MOCK_COUPONS` (라인 20-92)
   - `handleUseCoupon()` 함수 수정 필요
   - API: `/api/coupons`, `/api/coupons/{id}/use`

5. **AuthContext.js**
   - `login()`, `signup()` 함수 수정 필요
   - API: `/api/auth/login`, `/api/auth/signup`

### 백엔드 연결 예시

```javascript
// DashboardScreen.js loadData() 예시
const loadData = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 대시보드 요약 데이터
        const summaryRes = await fetch(`${API_BASE_URL}/dashboard/summary`, { headers });
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        // AI 예측 거래 데이터 (ML 모델 결과)
        const predictionRes = await fetch(`${API_BASE_URL}/predictions/next`, { headers });
        const predictionData = await predictionRes.json();
        setPredictedTransaction(predictionData);

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};
```

### 필요한 백엔드 API 엔드포인트

#### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

#### 대시보드
- `GET /api/dashboard/summary` - 요약 통계
- `GET /api/dashboard/monthly` - 월별 지출 데이터
- `GET /api/dashboard/category` - 카테고리별 소비

#### AI/ML
- `GET /api/predictions/next` - ML 모델 예측 거래
- `GET /api/anomalies` - ML 모델 탐지 이상거래

#### 거래내역
- `GET /api/transactions` - 거래내역 목록
- `POST /api/transactions/{id}/anomaly` - 이상거래 신고

#### 쿠폰 (NEW!)
- `GET /api/coupons` - 사용자 쿠폰 목록
- `POST /api/coupons/{id}/use` - 쿠폰 사용
- `GET /api/coupons/available` - 사용 가능한 쿠폰만
- `POST /api/coupons/issue` - AI 예측 기반 자동 쿠폰 발급

---

## 📦 기술 스택

### Frontend
- **React Native** (Expo) - 크로스 플랫폼
- **React Navigation** - 화면 전환
- **React Native Chart Kit** - 차트 시각화
- **AsyncStorage** - 로컬 저장소
- **Context API** - 상태 관리

### 추가 설치 필요 (백엔드 연결 시)
```bash
npm install axios
# 또는
npm install @tanstack/react-query
```

### Backend (권장)
- **FastAPI** (Python) - ML 모델 연동 용이
- **PostgreSQL** - 데이터베이스
- **TensorFlow/PyTorch** - ML 모델
- **Redis** - 캐싱

---

## 🤖 ML 모델 요구사항

백엔드에서 다음 ML 모델을 구현해야 합니다:

### 1. 이상거래 탐지 모델
- **입력**: 거래 금액, 시간, 가맹점, 위치, 사용자 패턴
- **출력**: 
  - `risk_level`: '높음' | '중간' | '낮음'
  - `confidence`: 0.0 ~ 1.0
  - `reason`: 의심 이유 텍스트

### 2. 다음 구매 예측 모델
- **입력**: 사용자 거래 이력, 시간, 요일, 위치
- **출력**:
  - `merchant`: 예측 가맹점 이름
  - `category`: 카테고리
  - `predicted_amount`: 예상 금액
  - `predicted_time`: 예상 시간
  - `confidence`: 신뢰도 (%)

---

## 🔧 개발 가이드

### 코드 스타일
- ESLint 설정 준수
- 컴포넌트는 함수형으로 작성
- Hooks 사용 (useState, useEffect, useContext)

### 주석 규칙
모든 백엔드 연결 포인트에는 다음과 같은 주석이 있습니다:

```javascript
// ============================================================
// TODO: 백엔드 연결 시 수정 필요
// ============================================================
// 현재는 MOCK 데이터 사용
// 백엔드 API 연결 시 이 부분을 수정하세요.
//
// 예시 코드:
// const response = await fetch(`${API_BASE_URL}/endpoint`);
// ============================================================
```

### Git Workflow
```bash
# 기능 개발
git checkout -b feature/기능명

# 커밋
git commit -m "feat: 기능 설명"

# 푸시
git push origin feature/기능명
```

---

## 📞 팀원 가이드

### 처음 시작하는 경우
1. 저장소 클론
2. `frontend/` 폴더로 이동
3. `npm install` 실행
4. `npm start` 실행
5. 웹 브라우저에서 확인

### 백엔드 개발자
1. 위의 "필요한 백엔드 API 엔드포인트" 참고
2. ML 모델 요구사항 확인
3. 각 화면 파일의 `TODO: 백엔드` 주석 확인

### 프론트엔드 개발자
1. 기존 코드 리뷰
2. 새 기능 추가 시 Mock 데이터 먼저 작성
3. 백엔드 연결 포인트에 주석 추가

---

## 🐛 트러블슈팅

### 포트 충돌
```bash
# 기존 프로세스 종료
npx kill-port 19000 19001 19002
```

### node_modules 이슈
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 캐시 초기화
```bash
npm start -- --clear
```

---

## 📝 변경 이력

### v1.4.0 (2024-12-02) 🖥️
- ✨ **관리자 대시보드 고도화**
  - 이상 거래 탐지 메뉴 최상위로 이동 및 UI 개선
  - 사이드바 네비게이션 구조 개편
- 📚 **백엔드 연동 가이드 강화**
  - 관리자 페이지 내 "왕초보 백엔드 연동 가이드" 주석 추가
  - 초보자도 쉽게 따라 할 수 있는 `fetch` 예제 코드 제공
- ♻️ **코드 리팩토링**
  - 공통 UI 컴포넌트 분리 (`components/ui`)
  - TypeScript 타입 정의 중앙화 (`types/index.ts`)
  - 유지보수성 및 가독성 향상

### v1.3.0 (2024-12-01) 🎁
- ✨ **쿠폰함 탭 추가** - 전용 5번째 탭 신설
- ✨ **CouponScreen.js 구현** - 완전한 쿠폰 관리 화면
  - 검색 기능 (가맹점명)
  - 카테고리 필터 5개 (전체/식비/쇼핑/편의점/여가)
  - 3단계 섹션 (곧 만료/사용가능/사용완료)
  - 상세 쿠폰 카드 (할인금액, 최소구매, 만료일)
  - 접기/펼치기 토글 기능 (사용완료 쿠폰)
- ✨ **배너 광고 쿠폰 받기** - 대시보드 배너 "Get Coupon" 버튼 활성화
- 📝 **상세한 백엔드 연결 주석** - 모든 Mock 데이터에 API 연동 가이드 추가
  - DashboardScreen.js
  - TransactionScreen.js
  - AnomalyDetectionScreen.js
  - CouponScreen.js (NEW!)
- 🎨 **이모지 제거 및 커스터마이징 준비**
  - AI 스러운 이모지 전부 제거
  - TODO 주석으로 아이콘 커스터마이징 위치 표시
  - 가맹점 아이콘, 섹션 아이콘, 검색 아이콘 등
- 🐛 **토글 버튼 수정**
  - 사용완료 쿠폰이 항상 올바르게 표시되도록 수정
  - 필터링과 무관하게 정확한 개수 표시
- 📦 6개 Mock 쿠폰 데이터 (스타벅스, GS25, 올리브영, CGV, 맥도날드, 이마트)

### v1.2.0 (2024-12-01)
- ✨ 이상거래 3단계 범주 분류 추가 (안전/의심/위험)
- ✨ 고객센터 신고 기능 추가
- ✨ AI 예측 기반 광고 배너 추가
- ✨ 스타벅스 브랜드 스타일 배너 광고
- 📝 모든 파일에 백엔드 연결 주석 추가
- 🏗️ 프로젝트 구조 개선 (frontend 폴더 분리)

### v1.0.0 (2024-11-29)
- 🎉 초기 프론트엔드 완성
- ✅ 모든 주요 화면 구현
- ✅ Mock 데이터 적용

---

## 📞 문의

- **프로젝트 리드**: [이름]
- **이슈 등록**: GitHub Issues
- **문서**: `.gemini/antigravity/brain/` 폴더 참조

---

**Made with ☕ by Caffeine Team**
