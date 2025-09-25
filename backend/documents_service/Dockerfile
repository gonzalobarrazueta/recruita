FROM python:3.13-slim

WORKDIR /app

RUN mkdir -p /app/documents_service

COPY requirements.txt /app/documents_service

RUN pip install -r /app/documents_service/requirements.txt

COPY . /app/documents_service

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "documents_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
