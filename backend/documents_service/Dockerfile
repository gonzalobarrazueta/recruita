FROM python:3.13-slim

WORKDIR /app

COPY ./backend/documents_service/requirements.txt /app/

RUN pip install -r /app/requirements.txt

COPY ./backend/documents_service /app/documents_service

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "documents_service.main:app", "--host", "0.0.0.0", "--port", "8001"]
