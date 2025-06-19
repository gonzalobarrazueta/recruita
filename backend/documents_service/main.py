from fastapi import FastAPI, Depends, HTTPException
from starlette.middleware.cors import CORSMiddleware

from .routes import documents

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(documents.router)