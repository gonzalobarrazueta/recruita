from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette import status
from typing import Annotated
from uuid import UUID
from ..database.database import get_db
from ..models.conversations import Conversations
from ..models.messages import Messages, Sender
from ..services.conversations import get_or_create_conversation

router = APIRouter(
    prefix='/messages',
    tags=['messages']
)

db_dependency = Annotated[Session, Depends(get_db)]

@router.post(
    path='/',
    status_code=status.HTTP_201_CREATED
)
async def create_message(request: Request, db: db_dependency):
    data = await request.json()
    user_id: UUID = data['user_id']
    conversation_id: UUID = data['conversation_id']
    content: str = data['content']
    sender: Sender = data['sender']

    message = Messages(
        user_id=user_id,
        conversation_id=conversation_id,
        content=content,
        sender=Sender(sender)
    )

    db.add(message)
    db.commit()
    db.refresh(message)
