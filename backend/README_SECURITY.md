# 🛡️ 보안 기능 가이드 (실무 적용 버전)

카페인 프로젝트에 적용할 **현실적이고 실용적인 보안 기능**입니다.

> **⚠️ 이 문서는 "실제 구현 가이드"입니다**
> 
> 학생 프로젝트 일정을 고려하여 **필수 5가지 기능만** 상세히 다룹니다.
> - ✅ **실제 구현**: 비밀번호 해시, PII 암호화, Rate Limiting, 보안 헤더, 파일 로그
> - 📋 **설계만**: JWT 블랙리스트, 완전한 RBAC, 알림 시스템, 데이터 파기 (문서 하단 참고)
> 
> **예상 소요 시간**: 2~3일 (집중 작업 시)

---

## 📋 필수 구현 기능 (5가지)

1. [비밀번호 해시 + JWT 인증](#1-비밀번호-해시--jwt-인증)
2. [개인정보(PII) 암호화](#2-개인정보pii-암호화)
3. [API 속도 제한 (Rate Limiting)](#3-api-속도-제한-rate-limiting)
4. [보안 헤더](#4-보안-헤더)
5. [감사 로그 (파일)](#5-감사-로그-파일)

---

## 1. 비밀번호 해시 + JWT 인증

### 🎯 목적
- 비밀번호 평문 저장 금지
- 안전한 인증 토큰 발급

### ⏱️ 소요 시간: 반나절

### 💻 구현 코드

```python
# 필요한 라이브러리
from passlib.hash import bcrypt
from jose import jwt
from datetime import datetime, timedelta

# 비밀번호 해싱
def hash_password(password: str) -> str:
    """비밀번호를 bcrypt로 해싱"""
    return bcrypt.hash(password)

# 비밀번호 검증
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """입력한 비밀번호가 해시와 일치하는지 확인"""
    return bcrypt.verify(plain_password, hashed_password)

# JWT 토큰 생성
def create_access_token(user_id: int, role: str) -> str:
    """Access Token 생성 (만료: 30분)"""
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

# 회원가입 예시
@router.post("/register")
async def register(user_data: UserCreate, db: Session):
    # 비밀번호 해싱
    hashed_password = hash_password(user_data.password)
    
    # 사용자 생성
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    
    return {"message": "회원가입 성공"}

# 로그인 예시
@router.post("/login")
async def login(credentials: LoginRequest, db: Session):
    # 사용자 조회
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(401, "이메일 또는 비밀번호가 틀립니다")
    
    # JWT 토큰 발급
    token = create_access_token(user.id, user.role)
    
    return {"access_token": token, "token_type": "bearer"}
```

### ✅ 체크리스트
- [ ] `passlib[bcrypt]` 설치
- [ ] `python-jose[cryptography]` 설치
- [ ] User 모델에 `hashed_password` 컬럼 추가
- [ ] 회원가입/로그인 API 구현
- [ ] 토큰 검증 의존성(`get_current_user`) 구현

---

## 2. 개인정보(PII) 암호화

### 🎯 목적
DB 탈취 시에도 개인정보(전화번호, 계좌번호) 보호

### ⏱️ 소요 시간: 1일

### 🔐 방식
- **Fernet** (AES-128 대칭키 암호화)
- `hybrid_property`로 자동 암/복호화

### 💻 구현 코드

#### 1) 암호화 유틸리티 (`core/security.py`)

```python
from cryptography.fernet import Fernet
from app.core.config import settings

class EncryptionService:
    def __init__(self):
        self.cipher = Fernet(settings.ENCRYPTION_KEY.encode())
    
    def encrypt(self, plain_text: str) -> str:
        """평문 암호화"""
        if not plain_text:
            return ""
        encrypted_bytes = self.cipher.encrypt(plain_text.encode('utf-8'))
        return encrypted_bytes.decode('utf-8')
    
    def decrypt(self, encrypted_text: str) -> str:
        """암호문 복호화"""
        if not encrypted_text:
            return None
        decrypted_bytes = self.cipher.decrypt(encrypted_text.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')

# 전역 인스턴스
encryption_service = EncryptionService()

def encrypt_field(value: str) -> str:
    return encryption_service.encrypt(value)

def decrypt_field(value: str) -> str:
    return encryption_service.decrypt(value)
```

#### 2) User 모델에 적용 (`models/user.py`)

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from app.core.security import encrypt_field, decrypt_field

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    
    # 암호화된 컬럼 (실제 DB 저장)
    phone_number_encrypted = Column("phone_number", String(500))
    account_number_encrypted = Column("account_number", String(500))
    
    # 자동 암/복호화 프로퍼티
    @hybrid_property
    def phone_number(self) -> str:
        """읽을 때 자동 복호화"""
        if self.phone_number_encrypted:
            return decrypt_field(self.phone_number_encrypted)
        return None
    
    @phone_number.setter
    def phone_number(self, value: str):
        """저장할 때 자동 암호화"""
        if value:
            self.phone_number_encrypted = encrypt_field(value)
        else:
            self.phone_number_encrypted = None
    
    @hybrid_property
    def account_number(self) -> str:
        if self.account_number_encrypted:
            return decrypt_field(self.account_number_encrypted)
        return None
    
    @account_number.setter
    def account_number(self, value: str):
        if value:
            self.account_number_encrypted = encrypt_field(value)
        else:
            self.account_number_encrypted = None
```

#### 3) 암호화 키 생성

```bash
# .env 파일에 추가할 키 생성
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 📝 사용 예시

```python
# 회원가입 시
user = User(
    email="user@example.com",
    phone_number="01012345678"  # 자동으로 암호화되어 DB에 저장!
)
db.add(user)
db.commit()

# 조회 시
print(user.phone_number)  # "01012345678" (자동으로 복호화!)
```

### ✅ 체크리스트
- [ ] `cryptography` 설치
- [ ] `ENCRYPTION_KEY` 생성 및 `.env`에 추가
- [ ] `core/security.py` 작성
- [ ] User 모델 수정
- [ ] DB 마이그레이션 (컬럼 길이 500으로 변경)

---

## 3. API 속도 제한 (Rate Limiting)

### 🎯 목적
무차별 대입 공격(Brute Force) 및 DDoS 방지

### ⏱️ 소요 시간: 반나절

### ⚠️ 중요: Redis 필수!

```bash
# Redis 설치 (Docker)
docker run -d -p 6379:6379 redis:latest
```

### 💻 구현 코드

#### 1) main.py에 설정

```python
from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Limiter 초기화 (Redis 사용!)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    storage_uri="redis://localhost:6379"  # ⭐ Redis 필수!
)

app = FastAPI()
app.state.limiter = limiter

# 429 에러 커스터마이징
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={
            "error": "너무 많은 요청",
            "message": "잠시 후 다시 시도해주세요"
        }
    )
```

#### 2) API에 적용

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/login")
@limiter.limit("5/minute")  # 로그인은 분당 5회만!
async def login(request: Request, ...):
    pass

@router.post("/register")
@limiter.limit("10/minute")  # 회원가입은 분당 10회
async def register(request: Request, ...):
    pass

@router.get("/transactions")
@limiter.limit("60/minute")  # 거래 조회는 분당 60회
async def get_transactions(request: Request, ...):
    pass
```

### ✅ 체크리스트
- [ ] Redis 설치 및 실행
- [ ] `slowapi` 설치
- [ ] `redis` 라이브러리 설치
- [ ] main.py에 Limiter 설정
- [ ] 주요 API에 `@limiter.limit()` 적용

---

## 4. 보안 헤더

### 🎯 목적
브라우저 레벨에서 XSS, 클릭재킹 등 방어

### ⏱️ 소요 시간: 30분

### 💻 구현 코드

#### middlewares/security_headers.py

```python
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # MIME 스니핑 방지
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # 클릭재킹 방지 (iframe 차단)
        response.headers["X-Frame-Options"] = "DENY"
        
        # XSS 필터 활성화
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # HTTPS 강제 (HTTPS 적용 후 주석 해제)
        # response.headers["Strict-Transport-Security"] = "max-age=31536000"
        
        return response
```

#### main.py에 추가

```python
from app.middlewares.security_headers import SecurityHeadersMiddleware

app.add_middleware(SecurityHeadersMiddleware)
```

### ✅ 체크리스트
- [ ] `middlewares/security_headers.py` 작성
- [ ] main.py에 미들웨어 추가

---

## 5. 감사 로그 (파일)

### 🎯 목적
누가 언제 어떤 API에 접근했는지 추적

### ⏱️ 소요 시간: 1시간

### ⚠️ 중요: 파일 로그만! DB 저장 금지!

**이유**: DB에 저장하면 모든 요청마다 INSERT → 성능 폭망

### 💻 구현 코드

#### 1) middlewares/audit.py

```python
import time
import logging
from fastapi import Request
from starletter.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class AuditLoggingMiddleware(BaseHTTPMiddleware):
    # DB 저장 대신 로그 파일에만 기록!
    SENSITIVE_PATHS = [
        "/api/v1/transactions",
        "/api/v1/users",
        "/api/v1/auth",
    ]
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 클라이언트 IP 추출
        client_ip = request.headers.get("X-Forwarded-For", 
                     request.client.host if request.client else "unknown")
        
        # 요청 처리
        response = await call_next(request)
        
        # 처리 시간 계산
        process_time = time.time() - start_time
        
        # 파일 로그로 기록 (DB 저장 X)
        logger.info(
            f"{client_ip} - \"{request.method} {request.url.path}\" "
            f"{response.status_code} - {process_time:.3f}s"
        )
        
        # 민감한 경로는 별도 파일로
        if any(request.url.path.startswith(p) for p in self.SENSITIVE_PATHS):
            logger.warning(
                f"SENSITIVE ACCESS: {client_ip} - {request.method} {request.url.path}"
            )
        
        return response
```

#### 2) main.py 로깅 설정

```python
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/access.log"),  # 파일로 저장
        logging.StreamHandler()  # 콘솔에도 출력
    ]
)

# 미들웨어 추가
app.add_middleware(AuditLoggingMiddleware)
```

### 📊 로그 파일 예시

```
2024-12-02 15:30:45 - INFO - 123.456.789.0 - "POST /api/v1/auth/login" 200 - 0.125s
2024-12-02 15:30:50 - WARNING - SENSITIVE ACCESS: 123.456.789.0 - GET /api/v1/transactions
2024-12-02 15:30:55 - INFO - 123.456.789.0 - "GET /api/v1/dashboard" 200 - 0.089s
```

### 🎓 면접 답변

**Q: 왜 DB에 저장 안 했나요?**

> "처음에는 audit_logs 테이블에 저장하도록 설계했으나, 
> 모든 요청마다 DB INSERT가 발생하면 트래픽 증가 시 성능 병목이 우려되었습니다.
> 따라서 파일 로그로 남기고, 추후 ELK 스택이나 CloudWatch 도입을 통해 
> 로그 수집 파이프라인을 구축하는 방향으로 계획했습니다."

### ✅ 체크리스트
- [ ] `middlewares/audit.py` 작성
- [ ] `logs/` 디렉토리 생성
- [ ] main.py에 로깅 설정 추가
- [ ] 미들웨어 추가

---

## 📋 설계만 보여줄 기능들

아래 기능들은 **설계 문서와 부분 코드**로만 준비하고, 완전 구현은 생략합니다.

### 6. JWT 블랙리스트 (설계만)
- **문제**: Redis 필수, 로그인 전체 로직 수정 필요
- **대안**: Refresh Token 만료시간을 15분으로 짧게 설정
- **면접**: "JWT 블랙리스트를 설계했으나 Redis 인프라 미구축으로 보류"

### 7. RBAC 전체 적용 (부분만)
- **구현**: 관리자 API 2~3개에만 데코레이터 적용
- **면접**: "RBAC 구조를 설계하고 핵심 API에 적용"

### 8. Slack 알림 (설계만)
- **구현**: Webhook 코드 예시만
- **면접**: "비정상 패턴 알림 시스템을 설계"

### 9. 데이터 파기 스크립트 (설계만)
- **구현**: 스크립트 예시 코드만
- **면접**: "GDPR 준수 데이터 수명 관리 정책 수립"

---

## 🚀 실행 순서

### 1. 환경 설정

```bash
# 라이브러리 설치
pip install fastapi uvicorn
pip install passlib[bcrypt] python-jose[cryptography]
pip install cryptography
pip install slowapi redis

# Redis 실행
docker run -d -p 6379:6379 redis:latest
```

### 2. 환경 변수 (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/caffeine_db
SECRET_KEY=your-super-secret-jwt-key-here
ENCRYPTION_KEY=생성한-Fernet-키-여기에-붙여넣기
```

### 3. 구현 순서

1. ✅ 비밀번호 해시 + JWT (반나절)
2. ✅ PII 암호화 (1일)
3. ✅ Rate Limiting (반나절)
4. ✅ 보안 헤더 (30분)
5. ✅ 감사 로그 (1시간)

**총 소요 시간: 2~3일**

---

## 🎓 면접 대응 전략

### "왜 다 안 했어요?" 질문 대응

#### ❌ 나쁜 답변
"시간이 없어서요"

#### ✅ 시니어급 답변
"처음에는 전체 보안 기능을 설계했으나, 트래픽과 인프라를 고려하여 우선순위를 정했습니다. 
**성능 병목**이 발생할 수 있는 DB 기반 감사 로그 대신 파일 로그를, 
**인프라 의존도**가 높은 JWT 블랙리스트 대신 짧은 토큰 만료시간을 선택했습니다.
실무에서는 ELK 스택, Redis, API Gateway 등을 활용할 것입니다."

---

## ✅ 최종 체크리스트

### 코드 구현
- [ ] 비밀번호 해시 + JWT (passlib, jose)
- [ ] PII 암호화 (Fernet + hybrid_property)
- [ ] Rate Limiting (slowapi + Redis)
- [ ] 보안 헤더 미들웨어
- [ ] 감사 로그 미들웨어 (파일)

### 문서
- [ ] 설계 문서 (JWT 블랙리스트, RBAC, 알림, 데이터 파기)
- [ ] 면접 답변 준비

### 테스트
- [ ] 로그인/회원가입 동작 확인
- [ ] Rate Limit 초과 시 429 에러 확인
- [ ] 로그 파일 생성 확인
- [ ] 암호화된 데이터 DB 확인

---

**Made with 🛡️ Security First & 🎯 Reality Check**

**이 5가지만 구현해도 "보안까지 제대로 생각한 팀"이라는 평가를 받을 수 있습니다!**
