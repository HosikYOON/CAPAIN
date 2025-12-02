"""
FastAPI 메인 애플리케이션
보안 기능 통합: 암호화, 감사 로그, Rate Limiting
"""
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.middlewares.audit import AuditLoggingMiddleware
from app.database import init_db
from app.routers import auth, transactions

# Rate Limiter 초기화 (IP 기반)
limiter = Limiter(
    key_func=get_remote_address,  # 클라이언트 IP로 제한
    default_limits=["100/minute"],  # 기본 제한: 분당 100회
    enabled=settings.RATE_LIMIT_ENABLED  # .env에서 on/off 가능
)

# FastAPI 앱 생성
app = FastAPI(
    title="Caffeine API",
    description="AI 기반 금융 관리 API (보안 강화 버전)",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# Rate Limiter를 FastAPI에 연결
app.state.limiter = limiter

# Rate Limit 초과 시 커스텀 에러 핸들러
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Rate Limit 초과 시 반환할 커스텀 메시지
    
    보안:
        - 429 Too Many Requests 상태 코드 반환
        - Retry-After 헤더 포함 (언제 다시 시도 가능한지 알려줌)
        - 정확한 에러 메시지로 공격자에게 힌트 주지 않음
    """
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "error": "rate_limit_exceeded",
            "message": "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.",
            "detail": f"제한: {exc.detail}"
        },
        headers={"Retry-After": "60"}  # 60초 후 재시도 가능
    )

# 감사 로그 미들웨어 추가
app.add_middleware(AuditLoggingMiddleware)

# 라우터 등록
app.include_router(auth.router, prefix="/api/v1/auth", tags=["인증"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["거래"])


@app.on_event("startup")
async def startup_event():
    """
    앱 시작 시 실행
    - 데이터베이스 테이블 생성
    """
    await init_db()
    print("✅ 데이터베이스 초기화 완료")
    print(f"🔒 암호화 활성화: {bool(settings.ENCRYPTION_KEY)}")
    print(f"🚦 Rate Limiting: {settings.RATE_LIMIT_ENABLED}")


@app.get("/")
@limiter.limit("10/minute")  # 루트 경로는 분당 10회로 제한
async def root(request: Request):
    """
    API 루트 경로
    헬스 체크 및 환영 메시지
    """
    return {
        "message": "Caffeine API - 보안이 강화된 금융 관리 API",
        "version": "1.0.0",
        "security_features": {
            "encryption": "AES-128 (Fernet)",
            "audit_logging": "Enabled",
            "rate_limiting": "Enabled"
        }
    }


@app.get("/health")
async def health_check():
    """
    헬스 체크 (Rate Limit 없음)
    모니터링/로드밸런서에서 사용
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG  # 개발 환경에서만 자동 리로드
    )
