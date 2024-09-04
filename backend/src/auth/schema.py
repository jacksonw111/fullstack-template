from datetime import datetime
from typing import Optional
from pydantic import EmailStr, IPvAnyAddress
from sqlmodel import AutoString, Field, SQLModel

from src.models.role import Role


class RefreshToken(SQLModel):
    refresh_token: str


class CurrentUserResponse(SQLModel):
    name: str
    email: EmailStr
    gender: str
    current_role: Role
    last_login_at: Optional[datetime] = None
    last_login_ip: Optional[IPvAnyAddress] = Field(default=None, sa_type=AutoString)
    last_active_at: Optional[datetime] = None
    status: str
    initialized_at: Optional[datetime] = None
