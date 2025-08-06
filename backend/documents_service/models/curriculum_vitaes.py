from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, UTC
from ..database import Base
import uuid

class CurriculumVitaes(Base):
    __tablename__ = 'curriculum_vitaes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    applicant_id = Column(UUID(as_uuid=True), nullable=False)
    job_posting_id = Column(UUID(as_uuid=True), nullable=True)
    content = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.now(UTC), nullable=False)