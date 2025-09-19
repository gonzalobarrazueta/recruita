FROM python:3.13-slim

WORKDIR /app

COPY ./gateway/requirements.txt /app/

RUN pip install -r /app/requirements.txt

COPY ./gateway /app/gateway

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]