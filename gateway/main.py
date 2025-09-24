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

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service1(path: str, request: Request):
    url = f"{SERVICE1_AUTH_URL}/{path}"
    async with httpx.AsyncClient() as client:
        response = await client.request(
            request.method,
            url,
            params=dict(request.query_params),
            content=await request.body(),
            headers=dict(request.headers)
        )
    return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))


@app.api_route("/documents/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service2(path: str, request: Request):
    url = f"{SERVICE2_DOCUMENTS_URL}/{path}"
    async with httpx.AsyncClient() as client:
        response = await client.request(
            request.method,
            url,
            params=dict(request.query_params),
            content=await request.body(),
            headers=dict(request.headers)
        )
    return Response(content=response.content, status_code=response.status_code, headers=dict(response.headers))


@app.api_route("/agent/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_service3(path: str, request: Request):
    timeout = httpx.Timeout(60.0)
    try:
        url = f"{SERVICE3_AGENT_URL}/{path}"
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.request(
                request.method,
                url,
                params=dict(request.query_params),
                content=await request.body(),
                headers=dict(request.headers)
            )
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.ReadTimeout:
        logging.error(f"Request to {url} timed out after {timeout.read} seconds.")
        return JSONResponse(
            status_code=504,
            content={"error": f"Agent service did not respond in time (>{timeout.read}s)."}
        )
    except Exception as e:
        logging.exception(f"Error while forwarding request to {url}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

