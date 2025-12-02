"""
JWT 블랙리스트 모델
로그아웃된 토큰을 저장하여 재사용 방지
"""
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class JWTBlacklist(Base):
    """
    JWT 블랙리스트 테이블
    
    목적:
    - 로그아웃한 토큰 즉시 무효화
    - JWT의 Stateless 특성 보완
    
    보안 이슈:
    - JWT는 발급 후 만료까지 유효
    - 로그아웃해도 토큰이 탈취되면 계속 사용 가능
    
    해결책:
    - 로그아웃 시 해당 토큰을 블랙리스트에 등록
    - 모든 인증 요청에서 블랙리스트 확인
    - 블랙리스트에 있으면 거부
    
    성능 고려:
    - Redis 사용 권장 (빠른 조회)
    - DB 사용 시 인덱스 필수
    - 만료된 토큰은 주기적으로 삭제
    """
    __tablename__ = "jwt_blacklist"
    
    # JTI (JWT ID): 토큰의 고유 식별자
    # - JWT payload의 "jti" 클레임 사용
    # - 토큰마다 고유한 ID 부여
    jti = Column(String(255), primary_key=True, index=True)
    
    # 토큰 자체 (디버깅용, 선택사항)
    token = Column(String(500), nullable=True)
    
    # 사용자 ID (누가 로그아웃했는지 추적)
    user_id = Column(String(100), index=True)
    
    # 블랙리스트 등록 시간
    blacklisted_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    # 토큰 만료 시간 (자동 정리용)
    # - 토큰이 자연스럽게 만료되면 블랙리스트에서도 삭제 가능
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    
    def __repr__(self):
        return f"<JWTBlacklist(jti={self.jti}, user_id={self.user_id})>"
