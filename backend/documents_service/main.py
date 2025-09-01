from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .routes import job_postings, cv, job_matches
from .database import Base, engine
from .models.job_postings import JobPostings
from .models.job_matches import JobMatches

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(job_postings.router)
app.include_router(cv.router)
app.include_router(job_matches.router)

Base.metadata.create_all(bind=engine)