from pydantic import BaseModel

class TermsConditionsRequest(BaseModel):
    accept: bool