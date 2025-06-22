from pydantic import BaseModel
from uuid import UUID
from enum import Enum

class JobCategory(str, Enum):
    DATA = 'data'
    CLOUD = 'cloud'
    OTHERS = 'others'

class CreateJobPostingRequest(BaseModel):
    recruiter_id: UUID
    title: str
    years_of_experience: int
    category: JobCategory
    company_name: str
    company_image: str
    requirements: str
    full_description: str