from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated

from ..database.database import get_db
from ..models.conversations import Conversations
from ..models.messages import Messages

router = APIRouter(
    prefix='/conversations',
    tags=['conversations']
)

db_dependency = Annotated[Session, Depends(get_db)]

@router.get(
    path='/{applicant_id}/{job_posting_id}',
    status_code=status.HTTP_200_OK
)
async def get_or_create_conversation(applicant_id: str, job_posting_id: str, db: db_dependency):
    conversation = db.query(Conversations).filter_by(
        user_id=applicant_id,
        job_posting_id=job_posting_id
    ).first()

    if conversation:
        messages = db.query(Messages).filter_by(conversation_id=conversation.id).order_by(Messages.created_at).all()
    else:
        conversation = Conversations(user_id=applicant_id, job_posting_id=job_posting_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        messages = []

    return {"conversation": conversation, "messages": messages}
