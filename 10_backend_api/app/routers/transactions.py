"""
거래 내역 API 라우터
Rate Limiting 및 감사 로그 적용
"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import List
from pydantic import BaseModel

from app.database import get_db

# Rate Limiter 초기화
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


class TransactionResponse(BaseModel):
    """거래 내역 응답 스키마"""
    id: int
    merchant: str
    category: str
    amount: float
    transaction_date: str
    is_anomaly: bool


@router.get("/", response_model=List[TransactionResponse])
@limiter.limit("60/minute")  # [보안] 거래 내역 조회는 분당 60회 제한
async def get_transactions(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    거래 내역 목록 조회
    
    보안:
    - Rate Limiting: 분당 60회
    - 감사 로그: /transactions 접근 기록 자동 저장
    - TODO: 인증 필요 (현재 사용자의 거래만 조회 가능하도록)
    
    예시:
        GET /api/v1/transactions?skip=0&limit=10
    """
    # TODO: 실제 구현
    # 1. 현재 로그인한 사용자 확인 (JWT에서 user_id 추출)
    # 2. 해당 사용자의 거래만 조회
    # 3. 페이지네이션 적용
    
    return {
        "message": "거래 내역 조회 (구현 필요)",
        "note": "✅ 이 API는 감사 로그에 자동으로 기록됩니다!"
    }


@router.get("/{transaction_id}", response_model=TransactionResponse)
@limiter.limit("60/minute")
async def get_transaction(
    request: Request,
    transaction_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    특정 거래 상세 조회
    
    보안:
    - 사용자 본인의 거래만 조회 가능 확인 필요
    - 감사 로그 자동 기록
    """
    # TODO: 구현
    return {
        "message": f"거래 ID {transaction_id} 조회 (구현 필요)"
    }
