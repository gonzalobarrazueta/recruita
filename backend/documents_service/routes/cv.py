from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated

from ..database import SessionLocal
from ..services import cv
from ..models.curriculum_vitaes import CurriculumVitaes

router = APIRouter(
    prefix='/cv',
    tags=['cv']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post(
    path='/upload',
    status_code=status.HTTP_201_CREATED,
)
async def upload_cv(
        db: db_dependency,
        applicant_id=Form(...),
        file: UploadFile = File(...)
):
    cv_content = await cv.extract_text_from_cv(file)

    new_cv = CurriculumVitaes(
        applicant_id=applicant_id,
        content=cv_content
    )

    db.add(new_cv)
    db.commit()
    db.refresh(new_cv)

    return {'response': new_cv}
