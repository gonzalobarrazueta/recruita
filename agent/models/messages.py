from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, DateTime, String, ForeignKey, Enum
from datetime import datetime, UTC
from ..database.database import Base
import uuid
import enum

class Sender(enum.Enum):
    USER = 'user'
    AI = 'ai'

class Messages(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    job_posting_id = Column(UUID(as_uuid=True), nullable=False)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('conversations.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC), nullable=False)
    content = Column(String, nullable=False)
    sender = Column(Enum(Sender), nullable=False)