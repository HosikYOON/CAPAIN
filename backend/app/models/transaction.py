"""
거래 내역 모델
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Transaction(Base):
    """
    거래 내역 테이블
    
    보안 고려사항:
    - user_id: 외래키로 사용자와 연결
    - 민감한 금융 거래 데이터이므로 audit_logs에 접근 기록
    - amount는 암호화하지 않음 (검색/집계 필요하므로)
    """
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 사용자 연결
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # 거래 정보
    merchant = Column(String(255), nullable=False)  # 가맹점
    category = Column(String(100), nullable=False, index=True)  # 카테고리
    amount = Column(Float, nullable=False)  # 거래 금액
    
    # 거래 날짜/시간
    transaction_date = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # 이상 거래 탐지 관련
    is_anomaly = Column(Boolean, default=False, index=True)  # ML 모델 예측 결과
    anomaly_score = Column(Float, nullable=True)  # 이상 점수 (0.0 ~ 1.0)
    anomaly_reason = Column(String(500), nullable=True)  # 이상 판정 이유
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 관계 (옵션)
    # user = relationship("User", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, merchant={self.merchant}, amount={self.amount})>"
