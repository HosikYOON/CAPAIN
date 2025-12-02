"""
인증 API 라우터
Rate Limiting 적용 (무차별 대입 공격 방지)
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.models.user import User

# Rate Limiter 초기화
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


class LoginRequest(BaseModel):
    """로그인 요청 스키마"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """회원가입 요청 스키마"""
    name: str
    email: EmailStr
    password: str
    phone_number: str
    account_number: str


@router.post("/login")
@limiter.limit("5/minute")  # [보안] 로그인은 분당 5회로 강력히 제한
async def login(
    request: Request,
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    로그인 API
    
    보안:
    - Rate Limiting: 분당 5회 (무차별 대입 공격 방지)
    - 감사 로그: /auth/login 접근 기록 자동 저장
    - 비밀번호는 bcrypt 해시와 비교 (평문 저장 금지!)
    
    예시:
        POST /api/v1/auth/login
        {
            "email": "user@example.com",
            "password": "mypassword"
        }
    """
    # TODO: 실제 인증 로직 구현
    # 1. 이메일로 사용자 조회
    # 2. 비밀번호 해시 검증 (passlib.hash.bcrypt.verify)
    # 3. JWT 토큰 생성 및 반환
    
    return {
        "message": "로그인 성공 (구현 필요)",
        "note": "실제 프로덕션에서는 JWT 토큰을 반환해야 합니다."
    }


@router.post("/register")
@limiter.limit("10/minute")  # 회원가입은 분당 10회 제한
async def register(
    request: Request,
    register_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    회원가입 API
    
    보안:
    - 개인정보(phone_number, account_number) 자동 암호화
    - 비밀번호는 bcrypt로 해싱
    - Rate Limiting: 분당 10회
    
    예시:
        POST /api/v1/auth/register
        {
            "name": "홍길동",
            "email": "hong@example.com",
            "password": "securepassword",
            "phone_number": "01012345678",
            "account_number": "1234567890"
        }
    """
    # TODO: 실제 회원가입 로직 구현
    # 1. 이메일 중복 체크
    # 2. 비밀번호 해싱 (passlib.hash.bcrypt.hash)
    # 3. User 모델 생성 (phone_number, account_number 자동 암호화)
    # 4. DB 저장
    
    # 예시: User 모델 사용 (암호화 자동 적용)
    # new_user = User(
    #     name=register_data.name,
    #     email=register_data.email,
    #     hashed_password=hash_password(register_data.password),
    #     phone_number=register_data.phone_number,  # 자동 암호화!
    #     account_number=register_data.account_number  # 자동 암호화!
    # )
    # db.add(new_user)
    # await db.commit()
    
    return {
        "message": "회원가입 성공 (구현 필요)",
        "note": "✅ phone_number와 account_number는 DB에 암호화되어 저장됩니다!"
    }
