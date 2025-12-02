# FastAPI Backend Dockerfile
# 보안 강화: Non-root user 실행

FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY ./app /app/app

# 🔒 보안: Non-root 사용자 생성 및 전환
# - 컨테이너가 탈취되어도 root 권한 없음
# - 호스트 시스템 피해 최소화
# - Kubernetes 등에서 보안 정책 준수
RUN adduser --disabled-password --gecos "" --uid 1000 caffeine-user \
    && chown -R caffeine-user:caffeine-user /app

# caffeine-user로 전환
USER caffeine-user

# 포트 노출
EXPOSE 8000

# 헬스 체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# 애플리케이션 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
