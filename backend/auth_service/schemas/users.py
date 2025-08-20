from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    name: str
    last_name: str
    phone_number: str
    email: str
    role: str
    password: str
    organization: str

class UserResponse(BaseModel):
    name: str
    last_name: str
    phone_number: str
    email: str
    role: str
    organization: str

    class Config:
        from_attributes = True