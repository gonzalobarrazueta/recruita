from fastapi import FastAPI, Depends, HTTPException

from .database import Base, engine
from typing import Annotated
from .routes.auth import get_current_user
from starlette import status
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth
from .routes import users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)

Base.metadata.create_all(bind=engine)

user_dependency = Annotated[dict , Depends(get_current_user)]

@app.get('/user', status_code=status.HTTP_200_OK)
async def user(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed.")
    return {'user': user}
