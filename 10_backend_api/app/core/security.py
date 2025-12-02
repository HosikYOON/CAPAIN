"""
개인정보 암호화/복호화 유틸리티
Fernet (대칭키 암호화) 사용
"""
from cryptography.fernet import Fernet, InvalidToken
from typing import Optional
from app.core.config import settings


class EncryptionService:
    """
    암호화 서비스 클래스
    
    보안 특징:
    - Fernet: AES 128-bit 대칭키 암호화 (안전하고 빠름)
    - 암호화된 데이터는 Base64로 인코딩되어 DB에 안전하게 저장 가능
    - 키는 환경 변수에서만 로드 (코드에 하드코딩 금지!)
    """
    
    def __init__(self):
        """
        암호화 키 초기화
        - 환경 변수에서 ENCRYPTION_KEY 로드
        - 키가 없으면 에러 발생 (보안상 기본값 사용 금지)
        """
        try:
            self.cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        except Exception as e:
            raise ValueError(
                "암호화 키가 올바르지 않습니다. "
                ".env 파일의 ENCRYPTION_KEY를 확인하세요. "
                f"생성 방법: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
            ) from e
    
    def encrypt(self, plain_text: str) -> str:
        """
        평문을 암호화
        
        Args:
            plain_text: 암호화할 평문 (예: 전화번호, 계좌번호)
        
        Returns:
            암호화된 문자열 (Base64 인코딩)
        
        보안:
            - 같은 평문도 매번 다른 암호문 생성 (Nonce 사용)
            - DB 탈취 시에도 원본 데이터 노출 불가
        """
        if not plain_text:
            return ""
        
        try:
            # 문자열 -> 바이트 -> 암호화 -> Base64 문자열
            encrypted_bytes = self.cipher.encrypt(plain_text.encode('utf-8'))
            return encrypted_bytes.decode('utf-8')
        except Exception as e:
            raise ValueError(f"암호화 실패: {str(e)}")
    
    def decrypt(self, encrypted_text: str) -> Optional[str]:
        """
        암호화된 텍스트를 복호화
        
        Args:
            encrypted_text: 암호화된 문자열
        
        Returns:
            복호화된 평문 (실패 시 None)
        
        보안:
            - 잘못된 키로는 복호화 불가 (InvalidToken 에러)
            - 데이터 무결성 검증 포함
        """
        if not encrypted_text:
            return None
        
        try:
            # Base64 문자열 -> 바이트 -> 복호화 -> 문자열
            decrypted_bytes = self.cipher.decrypt(encrypted_text.encode('utf-8'))
            return decrypted_bytes.decode('utf-8')
        except InvalidToken:
            # 복호화 실패: 잘못된 키 또는 손상된 데이터
            raise ValueError("복호화 실패: 암호화 키가 일치하지 않거나 데이터가 손상되었습니다.")
        except Exception as e:
            raise ValueError(f"복호화 중 오류 발생: {str(e)}")


# 전역 암호화 서비스 인스턴스 (싱글톤)
encryption_service = EncryptionService()


# 편의 함수
def encrypt_field(value: str) -> str:
    """개인정보 필드 암호화"""
    return encryption_service.encrypt(value)


def decrypt_field(value: str) -> Optional[str]:
    """개인정보 필드 복호화"""
    return encryption_service.decrypt(value)
