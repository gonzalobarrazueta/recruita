from dotenv import load_dotenv

from ..models.users import Users
from ..services.hashing import verify_password

from uuid import UUID
from datetime import timedelta, datetime, timezone
from jose import jwt

import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

def authenticate_user(email: str, password: str, db):
    user = db.query(Users).filter(Users.email == email).first()

    if not user:
        return False
    if not verify_password(password, user.password):
        return False

    return user

def create_access_token(email: str, user_id: UUID, role: str, expires: timedelta):
    encode = {
        'sub': email,
        'id': str(user_id),
        'role': role
    }
    expires = datetime.now(timezone.utc) + expires
    encode.update({'exp': expires})

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)