from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated

from ..database.database import get_db
from ..schemas.conversations import ConversationResponse
from ..services.conversations import get_or_create_conversation

router = APIRouter(
    prefix='/conversations',
    tags=['conversations']
)

db_dependency = Annotated[Session, Depends(get_db)]

@router.get(
    path='/{user_id}/{job_posting_id}',
    response_model=ConversationResponse,
    status_code=status.HTTP_200_OK
)
async def get_conversation(user_id: str, job_posting_id: str, db: db_dependency):

    conversation = get_or_create_conversation(db, user_id, job_posting_id)

    return conversation

