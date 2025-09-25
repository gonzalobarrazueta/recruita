from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base URLs for your internal container apps
SERVICE1_AUTH_URL = os.getenv("SERVICE1_AUTH_URL")
SERVICE2_DOCUMENTS_URL = os.getenv("SERVICE2_DOCUMENTS_URL")
SERVICE3_AGENT_URL = os.getenv("SERVICE3_AGENT_URL")


logging.basicConfig(level=logging.INFO)

@app.get("/")
async def root():
    return {"message": "Gateway is running"}


async def proxy_request(target_base: str, path: str, request: Request, timeout_seconds: float = 60.0):
    url = f"{target_base.rstrip('/')}/{path.lstrip('/')}"
    body = await request.body()

    # Filter headers
    excluded = {"host", "content-length", "connection"}
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded}

    logging.info(f"Forwarding {request.method} {url}")

    timeout = httpx.Timeout(timeout_seconds)

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.request(
                request.method,
                url,
                params=request.query_params,
                content=body,
                headers=headers
            )

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.ReadTimeout:
        logging.error(f"Request to {url} timed out after {timeout_seconds} seconds.")
        return JSONResponse(
            status_code=504,
            content={"error": f"Service did not respond in time (>{timeout_seconds}s)."}
        )
    except Exception as e:
        logging.exception(f"Error while forwarding request to {url}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service1(path: str, request: Request):
    return await proxy_request(SERVICE1_AUTH_URL, path, request)


@app.api_route("/documents/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service2(path: str, request: Request):
    return await proxy_request(SERVICE2_DOCUMENTS_URL, path, request)


@app.api_route("/agent/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service3(path: str, request: Request):
    return await proxy_request(SERVICE3_AGENT_URL, path, request)
