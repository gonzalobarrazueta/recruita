from typing import Optional

from pydantic import BaseModel
from uuid import UUID

class CreateUserRequest(BaseModel):
    name: str
    last_name: str
    phone_number: str
    email: str
    role: str
    password: str
    organization: str

class UserResponse(BaseModel):
    id: UUID
    name: str
    last_name: str
    phone_number: str
    email: str
    role: str
    organization: str
    pfp_image: Optional[str] = None
    terms_conditions_accepted: Optional[bool] = None

    class Config:
        from_attributes = True