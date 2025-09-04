from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Enum
from ..database import Base
import uuid
import enum

class UserRole(enum.Enum):
    APPLICANT = 'applicant'
    RECRUITER = 'recruiter'

class Users(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    password = Column(String, nullable=False)
    organization = Column(String)
    pfp_image = Column(String)