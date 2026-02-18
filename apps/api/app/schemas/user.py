from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    username: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDB):
    pass
