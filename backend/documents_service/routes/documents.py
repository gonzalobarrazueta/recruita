from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status

from ..database import SessionLocal
from ..models.job_postings import JobPostings, JobCategory
from ..schemas.job_postings import CreateJobPostingRequest

router = APIRouter(
    prefix='/documents',
    tags=['documents']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get('/', status_code=status.HTTP_200_OK)
def get_documents():
    return {'message': 'documents endpoint'}

@router.post('/create-job-posting', status_code=status.HTTP_201_CREATED)
async def create_posting(db: db_dependency, job_posting: CreateJobPostingRequest):

    new_job_posting = JobPostings(
        recruiter_id=job_posting.recruiter_id,
        title=job_posting.title,
        years_of_experience=job_posting.years_of_experience,
        category=JobCategory(job_posting.category),
        company_name=job_posting.company_name,
        requirements=job_posting.requirements,
        full_description=job_posting.full_description
    )

    db.add(new_job_posting)
    db.commit()
    db.refresh(new_job_posting)

    return new_job_posting
