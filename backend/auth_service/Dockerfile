FROM python:3.13-slim

WORKDIR /app

RUN mkdir -p /app/auth_service

COPY requirements.txt /app/auth_service

RUN pip install -r /app/auth_service/requirements.txt

COPY . /app/auth_service

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "auth_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
