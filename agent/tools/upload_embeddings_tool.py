from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

import ollama
import os
import uuid

load_dotenv()

pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])

def create_pinecone_index(index_name: str):
    pc.create_index(
        name=index_name,
        vector_type="dense",
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ),
        deletion_protection="disabled",
        tags={
            "environment": "development"
        }
    )

def get_index(index_name: str):
    if not pc.has_index(index_name):
        create_pinecone_index(index_name)
    return pc.Index(index_name)

def upload_embeddings(content: str, user_role: str, upload: str, ns: str) -> str:
    """
    Converts the provided text content into a vector and uploads it to a Pinecone database.

    Usage:
    - If the user is an applicant uploading their CV:
        - Set user_role = 'applicant'
        - Set upload = 'cv'
        - Set ns = 'ns-applicant-cvs'
    - If the user is a recruiter uploading a job description:
        - Set user_role = 'recruiter'
        - Set upload = 'job_description'
        - Set ns = 'ns-recruiter-job-description'
    """

    index_name = 'cv-matching'
    index = get_index(index_name)

    index.upsert(
        vectors=[{
            'id': str(uuid.uuid4()),
            'values': ollama.embeddings(model='nomic-embed-text', prompt=content)['embedding'],
            'metadata': {'user_role': user_role, 'upload': upload}
        }],
        namespace=ns
    )

    return 'Storing vector data...'