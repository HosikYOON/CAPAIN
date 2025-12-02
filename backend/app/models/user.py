"""
사용자 모델 (개인정보 암호화 적용)
phone_number와 account_number는 자동으로 암/복호화
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.hybrid import hybrid_property
from app.database import Base
from app.core.security import encrypt_field, decrypt_field


class User(Base):
    """
    사용자 테이블
    
    보안 특징:
    - phone_number_encrypted: DB에 암호화되어 저장
    - account_number_encrypted: DB에 암호화되어 저장
    - phone_number, account_number: 자동 암/복호화 프로퍼티
    
    사용 예시:
        user = User(name="홍길동", phone_number="01012345678")
        db.add(user)
        await db.commit()
        # DB에는 암호화된 값 저장
        
        print(user.phone_number)  # "01012345678" (자동 복호화)
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    
    # [보안] 암호화된 개인정보 필드 (실제 DB 컬럼)
    phone_number_encrypted = Column("phone_number", String(500))  # 암호화하면 길이↑
    account_number_encrypted = Column("account_number", String(500))
    
    # 비밀번호 해시 (암호화 아님! bcrypt 해싱)
    hashed_password = Column(String(255), nullable=False)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # [보안] 전화번호 암/복호화 자동 처리 프로퍼티
    @hybrid_property
    def phone_number(self) -> str:
        """
        전화번호 getter: 자동 복호화
        
        보안:
            - DB에서 읽을 때 자동으로 복호화
            - 애플리케이션 코드에서는 평문처럼 사용 가능
        """
        if self.phone_number_encrypted:
            return decrypt_field(self.phone_number_encrypted)
        return None
    
    @phone_number.setter
    def phone_number(self, value: str):
        """
        전화번호 setter: 자동 암호화
        
        보안:
            - DB에 저장하기 전 자동으로 암호화
            - 개발자가 암호화 로직을 신경 쓸 필요 없음
        """
        if value:
            self.phone_number_encrypted = encrypt_field(value)
        else:
            self.phone_number_encrypted = None
    
    # [보안] 계좌번호 암/복호화 자동 처리 프로퍼티
    @hybrid_property
    def account_number(self) -> str:
        """계좌번호 getter: 자동 복호화"""
        if self.account_number_encrypted:
            return decrypt_field(self.account_number_encrypted)
        return None
    
    @account_number.setter
    def account_number(self, value: str):
        """계좌번호 setter: 자동 암호화"""
        if value:
            self.account_number_encrypted = encrypt_field(value)
        else:
            self.account_number_encrypted = None
    
    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
