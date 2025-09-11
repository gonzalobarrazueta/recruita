FROM python:3.13-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy only the agent microservice
COPY ./agent /app/agent
COPY ./agent/requirements.txt /app/

RUN pip install -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "agent.main:app", "--host", "0.0.0.0", "--port", "8002"]
