FROM python:3.13-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN mkdir -p /app/agent

COPY requirements.txt /app/agent

RUN pip install -r /app/agent/requirements.txt

COPY . /app/agent

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "agent.main:app", "--host", "0.0.0.0", "--port", "8000"]
