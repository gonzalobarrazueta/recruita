FROM python:3.13-slim

WORKDIR /app

COPY ./backend/auth_service/requirements.txt /app/

RUN pip install -r /app/requirements.txt

COPY ./backend/auth_service /app/auth_service

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "auth_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
