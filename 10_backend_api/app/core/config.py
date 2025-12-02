"""
환경 설정 관리
.env 파일에서 설정값을 로드하고 관리합니다.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    애플리케이션 설정
    - .env 파일에서 자동으로 값을 로드
    - 타입 검증 및 기본값 제공
    """
    # 데이터베이스
    DATABASE_URL: str
    
    # 암호화 (Fernet 대칭키)
    ENCRYPTION_KEY: str
    
    # JWT 인증
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 환경
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    
    class Config:
        # .env 파일 위치
        env_file = ".env"
        # 대소문자 구분 안함
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    설정 객체를 하나만 생성하여 재사용 (싱글톤 패턴)
    - 성능 향상: 파일을 매번 읽지 않음
    - 메모리 효율적
    """
    return Settings()


# 전역 설정 객체
settings = get_settings()
