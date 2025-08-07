from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated

from ..database.database import get_db
from ..models.conversations import Conversations
from ..models.messages import Messages
from ..services.conversations import get_or_create_conversation

router = APIRouter(
    prefix='/conversations',
    tags=['conversations']
)

db_dependency = Annotated[Session, Depends(get_db)]

@router.get(
    path='/{applicant_id}/{job_posting_id}',
    status_code=status.HTTP_200_OK
)
async def get_conversation(applicant_id: str, job_posting_id: str, db: db_dependency):

    conversation = get_or_create_conversation(db, applicant_id, job_posting_id)

    return {"conversation": conversation}

