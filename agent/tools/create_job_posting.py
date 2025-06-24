from langchain_core.tools import tool
from dotenv import load_dotenv
import requests
import os

load_dotenv()

@tool
def create_job_posting(title: str, years_of_experience: int, category: str, company_name: str, requirements: str, full_description: str):
    """
    Creates a new job posting using the job-postings API. All fields are required.
    The category field must be one of: `data`, `cloud`, or `others`.
    Based on the job description, infer the most appropriate category and assign it to the category parameter.
    """
    data = {
        "recruiter_id": "",
        "title": title,
        "years_of_experience": years_of_experience,
        "category": category,
        "company_name": company_name,
        "requirements": requirements,
        "full_description": full_description
    }

    response = requests.post(os.getenv('CREATE_JOB_POSTING_TOOL_ENDPOINT'), data=data)

    if response.status_code != 201:
        return f"Failed to create job posting: {response.text}"

    return f"Success: {response.json()}"
