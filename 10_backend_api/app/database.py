"""
데이터베이스 연결 설정
SQLAlchemy를 사용한 비동기 PostgreSQL 연결
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# SQLAlchemy Base 클래스
Base = declarative_base()

# 비동기 엔진 생성
# postgresql:// -> postgresql+asyncpg:// (비동기 드라이버)
engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.DEBUG,  # SQL 쿼리 로그 출력 (개발 환경에서만)
    future=True,
)

# 비동기 세션 팩토리
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 커밋 후에도 객체 사용 가능
)


async def get_db():
    """
    데이터베이스 세션 의존성
    
    FastAPI의 Depends()와 함께 사용:
        @app.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    
    자동으로 세션을 열고 닫음 (컨텍스트 매니저)
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """
    데이터베이스 테이블 생성
    앱 시작 시 한 번 실행
    """
    async with engine.begin() as conn:
        # 모든 Base를 상속한 모델의 테이블 생성
        await conn.run_sync(Base.metadata.create_all)
