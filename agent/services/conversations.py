from fastapi import Depends
from sqlalchemy.orm import Session
from typing import Annotated
from ..database.database import get_db
from ..models.conversations import Conversations

db_dependency = Annotated[Session, Depends(get_db)]

def get_or_create_conversation(db: db_dependency, user_id: str, job_posting_id: str) -> Conversations:
    conversation = db.query(Conversations).filter_by(
        user_id=user_id,
        job_posting_id=job_posting_id
    ).first()

    if not conversation:
        conversation = Conversations(
            user_id=user_id,
            job_posting_id=job_posting_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    return conversation
