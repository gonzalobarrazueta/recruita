from sqlalchemy import Column, String, Enum, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base
import uuid
import enum

class JobCategory(enum.Enum):
    DATA = 'data'
    CLOUD = 'cloud'
    OTHERS = 'others'

class JobPostings(Base):
    __tablename__ = 'job_postings'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    years_of_experience = Column(Integer, nullable=False)
    category = Column(Enum(JobCategory), nullable=False)
    company_name = Column(String, nullable=False)
    company_image = Column(String, nullable=True)
    requirements = Column(String, nullable=False)
    full_description = Column(Text, nullable=False)
