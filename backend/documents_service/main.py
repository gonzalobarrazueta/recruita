from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .routes import documents
from .database import Base, engine
from .models.job_postings import JobPostings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(documents.router)

Base.metadata.create_all(bind=engine)