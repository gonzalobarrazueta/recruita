from uuid import UUID
from typing import List
from pydantic import BaseModel
from .messages import MessageResponse

class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    job_posting_id: UUID
    messages: List[MessageResponse]

    class Config:
        from_attributes = True