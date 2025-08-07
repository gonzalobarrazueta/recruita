from uuid import UUID
from pydantic import BaseModel
from ..models.messages import Sender

class MessageResponse(BaseModel):
    id: UUID
    content: str
    sender: Sender
    conversation_id: UUID

    class Config:
        from_attributes = True