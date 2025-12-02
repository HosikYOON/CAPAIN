# 📦 프로젝트 구조 재정리 마이그레이션 가이드

## 🎯 목표

기존 `caffeine-app` 구조를 엔터프라이즈급 모노레포 구조인 `ACT_CFI`로 전환

---

## 📊 현재 구조 → 새 구조 매핑

### 기존 구조 분석
```
caffeine-app/
├── backend/                    # FastAPI 백엔드
├── frontend/                   # React Native 사용자 앱
├── admin/                      # Next.js 관리자 대시보드
├── .github/workflows/          # CI/CD
└── README.md
```

### 새 구조 매핑표

| 기존 폴더 | 새 폴더 | 설명 |
|-----------|---------|------|
| `backend/` | `10_backend_api/` | FastAPI 서버 |
| `frontend/` | `20_frontend_user/` | React Native 앱 |
| `admin/` | `25_frontend_admin/` | Next.js 관리자 |
| _(새로 생성)_ | `00_docs_core/` | 아키텍처 문서 |
| _(새로 생성)_ | `30_ai_fds/` | 이상 거래 탐지 AI |
| _(새로 생성)_ | `40_ai_llm/` | 카테고리 분류 LLM |
| _(새로 생성)_ | `50_data_store/` | DB 스키마/마이그레이션 |

---

## 🚀 마이그레이션 단계

### Phase 1: 백업 및 준비 (필수!)
```bash
# 1. 현재 작업 커밋
git add .
git commit -m "Before restructure: Save current state"

# 2. 백업 브랜치 생성
git checkout -b backup/before-restructure

# 3. 작업 브랜치로 전환
git checkout main
git checkout -b feature/project-restructure
```

### Phase 2: 새 폴더 구조 생성
```bash
# 프로젝트 루트에서 실행
mkdir -p 00_docs_core/design
mkdir -p 00_docs_core/manuals
mkdir -p 10_backend_api
mkdir -p 20_frontend_user
mkdir -p 25_frontend_admin
mkdir -p 30_ai_fds/model_train
mkdir -p 30_ai_fds/model_inference
mkdir -p 40_ai_llm/prompt_eng
mkdir -p 40_ai_llm/lang_chain
mkdir -p 50_data_store/init_sql
mkdir -p 50_data_store/migrations
```

### Phase 3: 파일 이동

#### 3-1. Backend → 10_backend_api
```bash
# 방법 1: 복사 (안전)
cp -r backend/* 10_backend_api/

# 방법 2: 이동 (권장 - git 히스토리 유지)
git mv backend 10_backend_api
```

**내부 구조 재정리** (선택사항):
```bash
cd 10_backend_api
mkdir -p app_main routers_user routers_admin database

# 현재 app/ 폴더 내용을 기능별로 분리
# - app/main.py → app_main/
# - app/routers/ → routers_user/ + routers_admin/
# - app/models/ → database/models/
```

#### 3-2. Frontend → 20_frontend_user
```bash
git mv frontend 20_frontend_user

cd 20_frontend_user
mkdir -p src_components src_pages

# 기존 src/components/ → src_components/
# 기존 src/screens/ → src_pages/
```

#### 3-3. Admin → 25_frontend_admin
```bash
git mv admin 25_frontend_admin

cd 25_frontend_admin
mkdir -p src_dashboard src_auth

# src/app/ 내용을 논리적으로 재분류
```

#### 3-4. 문서 이동 → 00_docs_core
```bash
# 기존 README, 가이드 문서들 이동
mv README.md 00_docs_core/manuals/
mv README_SECURITY.md 00_docs_core/manuals/
mv TEAM_GUIDE.md 00_docs_core/manuals/
mv PROJECT_HANDOFF.md 00_docs_core/manuals/

# 새 루트 README 생성
cat > README.md << 'EOF'
# ACT_CFI - Caffeine Financial Intelligence

엔터프라이즈급 AI 기반 금융 관리 시스템

## 📁 프로젝트 구조
- `00_docs_core/` - 아키텍처 문서
- `10_backend_api/` - FastAPI 백엔드
- `20_frontend_user/` - 사용자 앱
- `25_frontend_admin/` - 관리자 대시보드
- `30_ai_fds/` - 이상 거래 탐지
- `40_ai_llm/` - LLM 분류
- `50_data_store/` - 데이터베이스

자세한 내용은 `00_docs_core/manuals/` 참고
EOF
```

#### 3-5. AI 모델 폴더 생성 (향후 작업)
```bash
# 30_ai_fds - 이상 거래 탐지 (Fraud Detection System)
cd 30_ai_fds
cat > README.md << 'EOF'
# Fraud Detection System

PyTorch 기반 이상 거래 탐지 시스템

## 구조
- `model_train/` - 모델 학습 코드
- `model_inference/` - 실시간 추론 API

## TODO
- [ ] 기존 ML 모델 코드 통합
- [ ] 학습 파이프라인 구성
- [ ] FastAPI와 연동
EOF

# 40_ai_llm - LLM 기반 카테고리 분류
cd ../40_ai_llm
cat > README.md << 'EOF'
# LLM Category Classifier

LangChain/OpenAI 기반 거래 카테고리 자동 분류

## 구조
- `prompt_eng/` - 프롬프트 엔지니어링
- `lang_chain/` - LangChain 로직

## TODO
- [ ] 프롬프트 템플릿 작성
- [ ] LLM API 연동
- [ ] 카테고리 분류 로직
EOF
```

#### 3-6. DB 스키마 이동 → 50_data_store
```bash
cd 50_data_store/init_sql

# 백엔드에 있던 DB 관련 파일 복사
# (실제 경로는 프로젝트에 맞게 수정)
# cp ../../10_backend_api/database/models.py ./schema.sql
```

### Phase 4: 설정 파일 업데이트

#### 4-1. CI/CD 경로 수정 (.github/workflows/)
```yaml
# frontend-ci.yml
jobs:
  build:
    steps:
      - working-directory: ./20_frontend_user  # 경로 변경

# backend-ci.yml
jobs:
  build:
    steps:
      - working-directory: ./10_backend_api  # 경로 변경
```

#### 4-2. Docker Compose 수정 (있다면)
```yaml
services:
  backend:
    build: ./10_backend_api
  frontend:
    build: ./20_frontend_user
  admin:
    build: ./25_frontend_admin
```

#### 4-3. package.json / requirements.txt 경로 확인
- 각 폴더의 설정 파일들이 상대 경로를 제대로 참조하는지 확인

### Phase 5: 테스트 및 검증
```bash
# 1. 각 서비스 개별 실행 테스트
cd 10_backend_api && python -m app.main
cd 20_frontend_user && npm start
cd 25_frontend_admin && npm run dev

# 2. 빌드 테스트
cd 10_backend_api && pip install -r requirements.txt
cd 20_frontend_user && npm install && npm run build
cd 25_frontend_admin && npm install && npm run build

# 3. CI/CD 파이프라인 테스트
git push origin feature/project-restructure
# GitHub Actions 확인
```

---

## ⚠️ 주의사항

### 1. Import 경로 변경 필요
프로젝트 구조가 바뀌면 import 경로도 수정해야 합니다:

**Python (Backend)**:
```python
# Before
from app.core.security import encrypt_field

# After (폴더 내부 구조도 변경했다면)
from app_main.core.security import encrypt_field
```

**TypeScript (Frontend)**:
```typescript
// Before
import { Header } from '@/components/Header';

// After (폴더 이름만 변경)
// 변경 없음 (tsconfig.json의 paths가 프로젝트 내부 경로이므로)
```

### 2. Git 히스토리 보존
```bash
# git mv 사용 시 히스토리 유지됨
git mv backend 10_backend_api

# 일반 mv 사용 시 새 파일로 인식됨 (비추천)
mv backend 10_backend_api
```

### 3. 팀원 동기화
```markdown
팀원들에게 공지:
1. 최신 main 브랜치 pull
2. 기존 로컬 브랜치 삭제
3. node_modules, venv 등 재설치
4. 새 경로에서 개발 서버 재실행
```

---

## 📝 마이그레이션 완료 체크리스트

### 필수 작업
- [ ] 백업 브랜치 생성
- [ ] 새 폴더 구조 생성
- [ ] backend → 10_backend_api 이동
- [ ] frontend → 20_frontend_user 이동
- [ ] admin → 25_frontend_admin 이동
- [ ] 문서들 → 00_docs_core 이동
- [ ] CI/CD 설정 경로 수정
- [ ] 각 서비스 실행 테스트
- [ ] 팀원 공지

### 선택 작업
- [ ] Backend 내부 구조 재정리 (app_main, routers_user 등)
- [ ] Frontend 내부 구조 재정리 (src_components, src_pages)
- [ ] AI 모델 폴더 구성 (30_ai_fds, 40_ai_llm)
- [ ] DB 스키마 분리 (50_data_store)

---

## 🎯 권장 접근법

### 옵션 A: 단계별 이동 (안전)
1. 먼저 폴더 이름만 변경 (backend → 10_backend_api)
2. 테스트 후 내부 구조 재정리
3. AI/DB 폴더는 나중에 추가

### 옵션 B: 한 번에 완전 재구성 (빠름)
1. 모든 폴더 한 번에 생성 및 이동
2. 설정 파일 일괄 수정
3. 전체 테스트

**학생 프로젝트라면 옵션 A 추천!**

---

## 🚀 빠른 시작 스크립트

```bash
#!/bin/bash
# migrate.sh - 자동 마이그레이션 스크립트

echo "🔄 프로젝트 재구조화 시작..."

# 1. 백업
git checkout -b backup/before-restructure
git checkout main
git checkout -b feature/project-restructure

# 2. 새 폴더 생성
mkdir -p 00_docs_core/{design,manuals}
mkdir -p 10_backend_api
mkdir -p 20_frontend_user
mkdir -p 25_frontend_admin
mkdir -p 30_ai_fds/{model_train,model_inference}
mkdir -p 40_ai_llm/{prompt_eng,lang_chain}
mkdir -p 50_data_store/{init_sql,migrations}

# 3. 파일 이동 (git mv로 히스토리 유지)
git mv backend 10_backend_api
git mv frontend 20_frontend_user
git mv admin 25_frontend_admin

# 4. 문서 이동
mv README*.md 00_docs_core/manuals/ 2>/dev/null
mv *_GUIDE.md 00_docs_core/manuals/ 2>/dev/null

echo "✅ 이동 완료! 이제 CI/CD 설정과 import 경로를 수정하세요."
```

---

**다음 단계:** 실제로 마이그레이션을 진행하시겠습니까? 자동 스크립트를 실행하거나 수동으로 진행할 수 있습니다.
