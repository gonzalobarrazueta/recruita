from fastapi import APIRouter
from starlette import status

router = APIRouter(
    prefix='/documents',
    tags=['documents']
)

@router.get('/', status_code=status.HTTP_200_OK)
def get_documents():
    return {'message': 'documents endpoint'}