from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated, List
from uuid import UUID

from ..database import SessionLocal
from ..models.job_matches import JobMatches
from ..schemas.job_matches import JobMatchResponse, CreateJobMatch

router = APIRouter(
    prefix='/matches',
    tags=['matches']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post(
    path='/add',
    status_code=status.HTTP_201_CREATED
)
def add_match(
        create_job_match: CreateJobMatch,
        db: db_dependency
):
    job_match = JobMatches(
        job_id=create_job_match.jobid,
        applicant_id=create_job_match.applicant_id,
        match_percentage=create_job_match.match_percentage,
    )

    db.add(job_match)
    db.commit()
    db.refresh(job_match)

@router.get(
    path='/{job_posting_id}',
    status_code=status.HTTP_200_OK,
    response_model=List[JobMatchResponse],
)
def get_job_matches_by_job_posting(
    job_posting_id: UUID,
    db: db_dependency
):
    matches = db.query(JobMatches).filter(JobMatches.job_id == job_posting_id).all()

    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found")

    return matches
