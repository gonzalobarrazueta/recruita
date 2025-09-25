FROM python:3.13-slim

WORKDIR /app

RUN mkdir -p /app/gateway

COPY requirements.txt /app/gateway

RUN pip install -r /app/gateway/requirements.txt

COPY . /app/gateway

CMD ["python", "-m", "uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "8000"]