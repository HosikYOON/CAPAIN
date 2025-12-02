# 🎯 초간단 폴더 재정리 가이드 (Windows 탐색기 버전)

## ⚠️ 시작 전 필수! 백업

**탐색기에서**:
1. `caffeine-app` 폴더 우클릭 → 복사
2. 같은 위치(`Desktop\1129`)에 붙여넣기
3. 이름 변경: `caffeine-app-백업-20241202`

✅ 백업 완료! 이제 안심하고 작업하세요.

---

## 📁 1단계: 폴더 이름 바꾸기 (탐색기)

### 현재 caffeine-app 폴더 안에서:

1. **backend 폴더** 우클릭 → 이름 바꾸기 → `10_backend_api`
2. **frontend 폴더** 우클릭 → 이름 바꾸기 → `20_frontend_user`
3. **admin 폴더** 우클릭 → 이름 바꾸기 → `25_frontend_admin`

✅ 기본 폴더 이름 변경 완료!

---

## 📁 2단계: 새 폴더 만들기 (PowerShell)

### PowerShell에서 실행:

```powershell
# caffeine-app 폴더로 이동
cd c:\Users\hi\Desktop\1129\caffeine-app

# 새 폴더 생성 (PowerShell 문법)
mkdir 00_docs_core
mkdir 00_docs_core\design
mkdir 00_docs_core\manuals

mkdir 30_ai_fds
mkdir 30_ai_fds\model_train
mkdir 30_ai_fds\model_inference

mkdir 40_ai_llm
mkdir 40_ai_llm\prompt_eng
mkdir 40_ai_llm\lang_chain

mkdir 50_data_store
mkdir 50_data_store\init_sql
mkdir 50_data_store\migrations
```

또는 **탐색기에서 직접**:
- caffeine-app 폴더 안에서 우클릭 → 새로 만들기 → 폴더
- 폴더 이름: `00_docs_core`, `30_ai_fds`, `40_ai_llm`, `50_data_store`
- 각 폴더 안에 하위 폴더 생성

---

## 📄 3단계: 문서 파일 이동 (탐색기)

### 다음 파일들을 `00_docs_core\manuals\` 폴더로 이동:

**탐색기에서 드래그 앤 드롭**:
- ✂️ `README.md`
- ✂️ `README_SECURITY.md` (backend 폴더 안에 있음)
- ✂️ `README_SECURITY_PRIORITIES.md` (backend 폴더 안에 있음)
- ✂️ `TEAM_GUIDE.md` (admin 폴더 안에 있음)
- ✂️ `BACKEND_INTEGRATION_GUIDE.md`
- ✂️ `PROJECT_HANDOFF.md`
- ✂️ `MIGRATION_PLAN.md`

---

## 📝 4단계: 루트 README.md 새로 만들기

**메모장으로 새 파일 만들기**:

1. 메모장 열기
2. 아래 내용 복사해서 붙여넣기:

```markdown
# ACT_CFI - Caffeine Financial Intelligence

AI 기반 금융 관리 시스템

## 📁 프로젝트 구조

- `00_docs_core/` - 📚 프로젝트 문서 (README, 가이드)
- `10_backend_api/` - 🔧 FastAPI 백엔드 서버
- `20_frontend_user/` - 📱 React Native 사용자 앱
- `25_frontend_admin/` - 💻 Next.js 관리자 대시보드
- `30_ai_fds/` - 🤖 이상 거래 탐지 AI (향후 추가)
- `40_ai_llm/` - 🧠 LLM 카테고리 분류 (향후 추가)
- `50_data_store/` - 💾 데이터베이스 스키마

## 🚀 빠른 시작

### 백엔드
```bash
cd 10_backend_api
pip install -r requirements.txt
python -m app.main
```

### 사용자 앱
```bash
cd 20_frontend_user
npm install
npm start
```

### 관리자 대시보드
```bash
cd 25_frontend_admin
npm install
npm run dev
```

## 📖 자세한 문서

모든 가이드는 `00_docs_core/manuals/` 폴더에 있습니다.
```

3. 다른 이름으로 저장 → `c:\Users\hi\Desktop\1129\caffeine-app\README.md`

---

## ⚙️ 5단계: CI/CD 설정 파일 수정

### `.github\workflows\frontend-ci.yml` 파일 수정:

**메모장으로 열어서**:

```yaml
# 경로 찾기: working-directory: ./frontend
# 바꾸기: working-directory: ./20_frontend_user
```

저장!

---

## ✅ 6단계: 테스트

### 각 서비스가 정상 작동하는지 확인:

```powershell
# 백엔드 테스트
cd 10_backend_api
python -m app.main
# Ctrl+C로 종료

# 프론트엔드 테스트
cd ..\20_frontend_user
npm start
# Ctrl+C로 종료

# 관리자 테스트
cd ..\25_frontend_admin
npm run dev
# Ctrl+C로 종료
```

모두 정상 작동하면 성공! 🎉

---

## 📊 완료 후 폴더 구조

```
caffeine-app/
├── 00_docs_core/               ✅ 새로 생성
│   ├── design/
│   └── manuals/                (모든 README 파일들)
│
├── 10_backend_api/             ✅ backend에서 이름 변경
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── 20_frontend_user/           ✅ frontend에서 이름 변경
│   ├── src/
│   ├── package.json
│   └── ...
│
├── 25_frontend_admin/          ✅ admin에서 이름 변경
│   ├── src/
│   ├── package.json
│   └── ...
│
├── 30_ai_fds/                  ✅ 새로 생성 (비어있음)
│   ├── model_train/
│   └── model_inference/
│
├── 40_ai_llm/                  ✅ 새로 생성 (비어있음)
│   ├── prompt_eng/
│   └── lang_chain/
│
├── 50_data_store/              ✅ 새로 생성 (비어있음)
│   ├── init_sql/
│   └── migrations/
│
├── .github/                    (그대로)
├── .gitignore                  (그대로)
└── README.md                   ✅ 새로 생성
```

---

## 🚨 문제 해결

### "서비스가 안 돌아가요!"
→ node_modules 재설치:
```powershell
cd 20_frontend_user
Remove-Item -Recurse -Force node_modules
npm install
```

### "import 에러가 나요!"
→ 대부분 내부 경로는 변경 안 해도 됩니다.
→ 만약 에러가 나면 어떤 에러인지 알려주세요.

### "Git이 꼬였어요!"
→ 백업 폴더에서 복원:
1. 현재 `caffeine-app` 폴더 삭제
2. `caffeine-app-백업-20241202` 이름을 `caffeine-app`으로 변경

---

## 💡 선택사항 (나중에 해도 됨)

### Backend 내부 재정리 (고급)

**10_backend_api 안에서**:
```powershell
mkdir app_main, routers_user, routers_admin, database

# app/ 폴더 내용을 기능별로 분리
# (이건 복잡하니까 일단 스킵하셔도 됩니다!)
```

---

**이대로만 하면 끝! 막히는 부분 있으면 바로 물어보세요!** 🚀
