from sqlalchemy import Column, Float
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base

class JobMatches(Base):
    __tablename__ = 'job_matches'
    job_id = Column(UUID(as_uuid=True), primary_key=True)
    applicant_id = Column(UUID(as_uuid=True), primary_key=True)
    match_percentage = Column(Float, nullable=False)