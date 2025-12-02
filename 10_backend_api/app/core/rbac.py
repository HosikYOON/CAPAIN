"""
RBAC (Role-Based Access Control) 데코레이터
역할 기반 접근 제어
"""
from functools import wraps
from fastapi import HTTPException, status
from typing import List


def require_role(allowed_roles: List[str]):
    """
    역할 기반 접근 제어 데코레이터
    
    사용 예시:
        @router.get("/admin/dashboard")
        @require_role(["admin"])
        async def admin_dashboard(current_user: User = Depends(get_current_user)):
            ...
    
    보안 원칙:
    - Least Privilege (최소 권한): 필요한 권한만 부여
    - Role-Based: 개인이 아닌 역할에 권한 부여
    - Fail-Safe: 권한 없으면 즉시 거부
    
    Args:
        allowed_roles: 허용할 역할 리스트 (예: ["admin", "manager"])
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # current_user는 JWT 토큰에서 추출 (Depends(get_current_user))
            current_user = kwargs.get('current_user')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="인증이 필요합니다."
                )
            
            # 사용자의 역할이 허용 목록에 있는지 확인
            user_role = getattr(current_user, 'role', None)
            
            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"접근 권한이 없습니다. 필요한 역할: {', '.join(allowed_roles)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# 편의 데코레이터
def admin_only(func):
    """관리자 전용 데코레이터"""
    return require_role(["admin"])(func)


def user_or_admin(func):
    """일반 사용자 또는 관리자"""
    return require_role(["user", "admin"])(func)
