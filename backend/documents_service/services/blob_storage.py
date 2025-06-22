from azure.storage.blob import BlobServiceClient, ContentSettings
from dotenv import load_dotenv
import uuid

import os

from fastapi import UploadFile

load_dotenv()

connection_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container = os.getenv('AZURE_STORAGE_CONTAINER_NAME')

blob_service_client = BlobServiceClient.from_connection_string(connection_str)

def upload_blob(image: UploadFile) -> str:
    blob_name = f'{uuid.uuid4()}-{image.filename}'

    blob_client = blob_service_client.get_blob_client(container=container, blob=blob_name)
    blob_client.upload_blob(image.file, overwrite=True, content_settings=ContentSettings(content_type=image.content_type))
    return blob_client.url