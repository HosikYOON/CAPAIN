"""
감사 로그 모델
누가 언제 어떤 API에 접근했는지 기록
"""
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class AuditLog(Base):
    """
    감사 로그 테이블
    
    보안 목적:
    - 데이터 접근 내역 추적
    - 이상 행위 패턴 탐지
    - 규정 준수 (GDPR, PCI-DSS)
    
    보관 정책:
    - 최소 1년 이상 보관 권장
    - 정기적으로 아카이빙 (파티셔닝)
    """
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 요청 정보
    ip_address = Column(String(45), nullable=False, index=True)  # IPv6 지원 (45자)
    http_method = Column(String(10), nullable=False)  # GET, POST, PUT, DELETE 등
    url_path = Column(String(500), nullable=False, index=True)  # 접근한 API 경로
    
    # 응답 정보
    status_code = Column(Integer, nullable=False)  # HTTP 상태 코드
    process_time = Column(Float, nullable=False)  # 처리 시간 (초)
    
    # 추가 정보
    user_agent = Column(String(500))  # 브라우저/클라이언트 정보
    user_id = Column(Integer, nullable=True, index=True)  # 인증된 사용자 ID (옵션)
    
    # 타임스탬프 (자동 생성)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  # DB 서버의 현재 시간으로 자동 설정
        nullable=False,
        index=True  # 날짜별 조회를 위해 인덱스
    )
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, ip={self.ip_address}, path={self.url_path})>"
