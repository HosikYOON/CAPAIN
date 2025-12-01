# ☕ Caffeine - 스마트 금융 관리 앱

프론트엔드 개발 완료! 백엔드 연결 준비 완료!

## 🚀 빠른 시작

```bash
cd caffeine-app
npm install
npm start
```

웹: `http://localhost:19006`

## 📖 중요 문서

### 🔴 백엔드 연결하기
📄 **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)**
- 모든 API 엔드포인트
- 코드 예시
- 마이그레이션 가이드

### 📝 상세 주석
📁 **[src/contexts/AuthContext.js](./src/contexts/AuthContext.js)**
- 완벽한 주석 예시
- 백엔드 연결 포인트 명시

### 📋 프로젝트 문서
📁 **[.gemini/antigravity/brain/.../walkthrough.md](C:\Users\Jinwoo\.gemini\antigravity\brain\3434d98d-1c06-4830-9d58-aef6d7469a85\walkthrough.md)**
- 전체 프로젝트 개요

## ✅ 완성된 기능

- ✅ 로그인/회원가입 (Mock)
- ✅ Dashboard (차트, 통계)
- ✅ 거래내역 (검색, 필터, 메모)
- ✅ 이상 탐지
- ✅ 프로필 (다크모드, 설정)
- ✅ EmptyState
- ✅ 검색 기능
- ✅ 비밀번호 토글

## 🔴 Mock 데이터 위치

**제거/교체 필요:**
- `src/contexts/AuthContext.js` - login, signup 함수
- `src/screens/DashboardScreen.js` - MOCK_DATA (Line 6)
- `src/screens/TransactionScreen.js` - MOCK_TRANSACTIONS (Line 6)
- `src/screens/AnomalyDetectionScreen.js` - MOCK_ANOMALIES (Line 5)

**→ 변경 방법: BACKEND_INTEGRATION_GUIDE.md 참조!**

## 🎯 다음 단계

1. **백엔드 API 개발** (FastAPI/Node.js)
2. **BACKEND_INTEGRATION_GUIDE.md** 따라하기
3. **테스트**
4. **배포**

## 📦 기술 스택

- React Native (Expo)
- React Navigation
- AsyncStorage
- React Native Chart Kit
- Context API

## 🌐 백엔드 연결 시 추가:

```bash
npm install axios
# 또는
npm install @tanstack/react-query
```

## 📞 도움말

**백엔드 연결:** BACKEND_INTEGRATION_GUIDE.md  
**주석 예시:** src/contexts/AuthContext.js  
**전체 문서:** walkthrough.md

---

**버전**: 1.0.0 (Frontend Complete)  
**마지막 업데이트**: 2024-12-01
