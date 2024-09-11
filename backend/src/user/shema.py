from datetime import datetime
from uuid import UUID
from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from src.models.role import Role


class UserSchema(SQLModel):
    name: str = Field(
        regex=r"^[a-zA-Z0-9_-]{3,16}$",
        description="username must be 3-16 characters long, only letters, numbers, underscores, and hyphens are allowed",  # noqa
    )
    gender: str
    email: EmailStr = Field(description="Must be a valid email address")
    password: str = Field(
        min_length=8, description="Password must be at least 8 characters long"
    )
    current_role_id: UUID


class UserCreate(UserSchema):
    pass


class UserUpdate(SQLModel):
    name: str | None = None
    email: str | None = None
    gender: str | None = None


class UserResponse(SQLModel):
    id: UUID
    name: str
    email: str
    status: str
    gender: str
    created_at: datetime
    updated_at: datetime
    role: Role
