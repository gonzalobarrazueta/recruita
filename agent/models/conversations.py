from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, DateTime
from datetime import datetime, UTC
from sqlalchemy.orm import relationship
from ..database.database import Base

import uuid

class Conversations(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    job_posting_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC), nullable=False)
    messages = relationship("Messages", backref="conversation", cascade="all, delete")