"""
보안 헤더 미들웨어
브라우저 레벨의 보안 설정을 응답 헤더에 추가
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    보안 헤더 미들웨어
    
    목적:
    - 브라우저에게 보안 정책 지시
    - OWASP Top 10 취약점 중 일부 방어
    - 구현 비용 낮지만 효과 큼
    
    적용 헤더:
    1. X-Content-Type-Options: MIME 스니핑 방지
    2. X-Frame-Options: 클릭재킹 방지
    3. X-XSS-Protection: XSS 필터 활성화
    4. Strict-Transport-Security (HSTS): HTTPS 강제
    """
    
    async def dispatch(self, request: Request, call_next):
        """모든 응답에 보안 헤더 추가"""
        response = await call_next(request)
        
        # 🛡️ X-Content-Type-Options: nosniff
        # - MIME 타입 추측 방지
        # - 예: text/html로 보낸 파일을 브라우저가 script로 실행하는 것 방지
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # 🛡️ X-Frame-Options: DENY
        # - 클릭재킹 공격 방지
        # - 우리 사이트를 다른 사이트의 iframe에 삽입 불가
        # - 공격자가 투명한 iframe으로 사용자 클릭 가로채기 방지
        response.headers["X-Frame-Options"] = "DENY"
        
        # 🛡️ X-XSS-Protection: 1; mode=block
        # - 구형 브라우저의 XSS 필터 활성화
        # - 최신 브라우저는 CSP 사용 권장
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # 🛡️ Strict-Transport-Security (HSTS)
        # - HTTPS로만 접속하도록 강제
        # - HTTPS 적용 후 주석 해제하세요!
        # - max-age=31536000: 1년간 HTTPS만 사용
        # - includeSubDomains: 서브도메인도 적용
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # 📝 추가 고려사항:
        # - Content-Security-Policy (CSP): XSS 방어 최강
        #   response.headers["Content-Security-Policy"] = "default-src 'self'"
        # - Referrer-Policy: 리퍼러 정보 제어
        #   response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response
