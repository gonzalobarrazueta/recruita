from pydantic import BaseModel
from uuid import UUID

class CreateJobMatch(BaseModel):
    applicant_id: UUID
    job_id: UUID
    match_percentage: float

class JobMatchResponse(BaseModel):
    applicant_id: UUID
    job_id: UUID
    match_percentage: float

    class Config:
        from_attributes = True
