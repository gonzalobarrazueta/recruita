from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from typing import Annotated, List
from sqlalchemy.orm import Session
from starlette import status
from uuid import UUID

from ..database import SessionLocal
from ..models.job_postings import JobPostings, JobCategory
from ..schemas.job_postings import JobPostingResponse
from ..services.blob_storage import upload_blob

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
async def create_posting(db: db_dependency,
                         recruiter_id: UUID = Form(...),
                         title: str = Form(...),
                         years_of_experience: int = Form(...),
                         category: JobCategory = Form(...),
                         company_name: str = Form(...),
                         requirements: str = Form(...),
                         full_description: str = Form(...),
                         company_image: UploadFile = File(None)
                         ):

    try:
        if company_image is not None:
            blob_url = upload_blob(company_image)
        else:
            blob_url = ""
    except:
        pass

    new_job_posting = JobPostings(
        recruiter_id=recruiter_id,
        title=title,
        years_of_experience=years_of_experience,
        category=JobCategory(category),
        company_name=company_name,
        company_image=blob_url,
        requirements=requirements,
        full_description=full_description
    )

    db.add(new_job_posting)
    db.commit()
    db.refresh(new_job_posting)

    return new_job_posting

@router.get(
    path='/job-postings',
    response_model=List[JobPostingResponse],
    status_code=status.HTTP_200_OK
)
def get_jobs(db: db_dependency):
    return db.query(JobPostings).all()

@router.get(
    path='/job-postings/{job_posting_id}',
    response_model=List[JobPostingResponse],
    status_code=status.HTTP_200_OK
)
def get_job(db: db_dependency, job_posting_id: UUID):
    postings = db.query(JobPostings).filter(JobPostings.id == job_posting_id).all()

    if not postings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found")

    return postings

@router.get(
    path='/job-postings/recruiter/{recruiter_id}',
    response_model=List[JobPostingResponse],
    status_code=status.HTTP_200_OK
)
def get_jobs_by_recruiter_id(db: db_dependency, recruiter_id: UUID):
    postings = db.query(JobPostings).filter(JobPostings.recruiter_id == recruiter_id).all()

    if not postings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="None job postings were found for this recruiter")

    return postings
