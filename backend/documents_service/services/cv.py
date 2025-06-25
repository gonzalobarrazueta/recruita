import os.path

from fastapi import HTTPException, UploadFile
from starlette import status
from fastapi import UploadFile
import fitz
import docx2txt

async def extract_text_from_cv(file: UploadFile):
    file_ext = await get_file_extension(file)
    content = await file.read()

    if file_ext == 'txt':
        return content.decode('utf-8')

    elif file_ext == 'pdf':
        file = fitz.open(stream=content, filetype='pdf')
        return '\n'.join(page.get_text() for page in file)

    else: # file_ext in ['doc', 'docx']
        temp_path = f'temp.{file_ext}'

        try:
            with open(temp_path, 'wb') as f:
                f.write(content)
            return docx2txt.process(temp_path)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

async def get_file_extension(file: UploadFile) -> str:
    file_ext = file.filename.lower().split('.')[-1]

    if file_ext in ['pdf', 'txt', 'doc', 'docx']:
        return file_ext
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail='File type not supported.'
        )
