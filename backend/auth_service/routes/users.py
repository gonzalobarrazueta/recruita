from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from typing import Annotated, Dict
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models.users import Users
from ..schemas.users import UserResponse

router = APIRouter(
    prefix='/users',
    tags=['users']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get(
    path='/{user_id}',
    response_model=UserResponse,
    status_code=status.HTTP_200_OK
)
def get_user_by_id(user_id: str, db: db_dependency):
    result = db.query(Users).filter(Users.id == user_id).first()
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')

    return result

@router.get(
    path='/terms-and-conditions/{user_id}',
    response_model=Dict,
    status_code=status.HTTP_200_OK
)
def check_user_terms_conditions(user_id: str, db: db_dependency):
    user = db.query(Users).filter(Users.id == user_id).first()
    return {'has_accepted': user.terms_conditions_accepted}
