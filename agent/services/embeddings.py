from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv
from typing import List
from uuid import uuid4
import os

load_dotenv()

oai_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])
messages_index_name='messages'

def create_pinecone_index(index_name: str):
    pc.create_index(
        name=index_name,
        vector_type='dense',
        dimension=1536,
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        ),
        deletion_protection='disabled',
        tags={
            'environment': 'production'
        }
    )

def get_index(index_name: str):
    if not pc.has_index(index_name):
        create_pinecone_index(index_name)
    return pc.Index(index_name)

def embed_text(text: str):
    return oai_client.embeddings.create(
        input=text,
        model='text-embedding-3-small'
    ).data[0].embedding

def store_embeddings(embedding: List[float], text: str, conversation_id: str):

    index = get_index(messages_index_name)

    index.upsert(
        vectors=[{
            'id': str(uuid4()),
            'values': embedding,
            'metadata': {
                'conversation_id': conversation_id,
                'text': text
            }
        }]
    )

# Returns a single string containing relevant past messages related to the current user query
def build_query_context(user_query: str, conversation_id: str) -> str:
    emb = embed_text(user_query)

    store_embeddings(emb, user_query, conversation_id)

    index = get_index(messages_index_name)

    results = index.query(
        vector=emb,
        top_k=3,
        include_metadata=True,
        filter={
            'conversation_id': {'$eq': conversation_id}
        }
    )

    context = "\n".join([match['metadata']['text'] for match in results['matches']])

    return context