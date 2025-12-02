"""
감사 로그 미들웨어
모든 HTTP 요청을 추적하고 민감한 경로는 DB에 기록
"""
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable
import logging

from app.models.audit_log import AuditLog
from app.database import get_db

# 로거 설정
logger = logging.getLogger(__name__)


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """
    감사 로그 미들웨어
    
    기능:
    - 모든 HTTP 요청의 IP, URL, Method, 처리 시간, 응답 코드 기록
    - 민감한 경로(/transactions, /users, /auth)는 DB에 영구 저장
    - 비민감 경로는 표준 로그만 기록 (성능 최적화)
    
    보안 이점:
    - 공격 패턴 탐지 가능
    - 데이터 접근 내역 추적
    - 규정 준수(GDPR, PCI-DSS)
    """
    
    # DB에 기록할 민감한 경로 패턴
    SENSITIVE_PATHS = [
        "/api/v1/transactions",
        "/api/v1/users",
        "/api/v1/auth",
        "/api/v1/admin",
        "/api/v1/anomalies",
    ]
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable):
        """
        모든 HTTP 요청을 가로채서 처리
        
        처리 순서:
        1. 요청 시작 시간 기록
        2. 실제 요청 처리 (call_next)
        3. 응답 완료 후 로그 기록
        """
        # 요청 시작 시간
        start_time = time.time()
        
        # 클라이언트 IP 추출
        client_ip = self._get_client_ip(request)
        
        # 실제 요청 처리
        response = await call_next(request)
        
        # 처리 시간 계산
        process_time = time.time() - start_time
        
        # 로그 기록
        await self._log_request(
            request=request,
            response=response,
            client_ip=client_ip,
            process_time=process_time
        )
        
        # 응답에 처리 시간 헤더 추가 (디버깅용)
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """
        클라이언트 실제 IP 주소 추출
        
        순서:
        1. X-Forwarded-For 헤더 (프록시/로드밸런서 뒤에 있을 때)
        2. X-Real-IP 헤더
        3. 직접 연결 IP
        
        보안:
            - 프록시 체인에서도 원본 IP 추적 가능
        """
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            # 여러 프록시를 거쳤을 경우 첫 번째가 원본 IP
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # 직접 연결
        return request.client.host if request.client else "unknown"
    
    def _is_sensitive_path(self, path: str) -> bool:
        """경로가 민감한 경로인지 확인"""
        return any(path.startswith(sensitive) for sensitive in self.SENSITIVE_PATHS)
    
    async def _log_request(
        self,
        request: Request,
        response,
        client_ip: str,
        process_time: float
    ):
        """
        요청 로그 기록
        
        - 민감한 경로: DB에 저장 🔒
        - 일반 경로: 표준 로그만 📝
        """
        path = request.url.path
        method = request.method
        status_code = response.status_code
        
        # 표준 로그 (항상 기록)
        logger.info(
            f"{client_ip} - \"{method} {path}\" {status_code} - {process_time:.3f}s"
        )
        
        # 민감한 경로는 DB에 영구 저장
        if self._is_sensitive_path(path):
            try:
                # 비동기 DB 세션 사용
                async for db in get_db():
                    audit_log = AuditLog(
                        ip_address=client_ip,
                        http_method=method,
                        url_path=path,
                        status_code=status_code,
                        process_time=process_time,
                        user_agent=request.headers.get("User-Agent", ""),
                    )
                    db.add(audit_log)
                    await db.commit()
                    break  # 첫 번째 세션만 사용
            except Exception as e:
                # DB 저장 실패 시에도 요청 처리는 계속
                logger.error(f"감사 로그 DB 저장 실패: {str(e)}")
