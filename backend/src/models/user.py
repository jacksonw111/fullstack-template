from datetime import datetime
import enum
from typing import Optional
from uuid import UUID
from pydantic import EmailStr, IPvAnyAddress
from sqlmodel import AutoString, Field, text

from src.models.base import BaseSQLModel, RecordeSQLModel


class UserStatus(str, enum.Enum):
    PENDING = "pending"
    UNINITIALIZED = "uninitialized"
    ACTIVE = "active"
    BANNED = "banned"
    CLOSED = "closed"


class UserGender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"


class User(BaseSQLModel, RecordeSQLModel, table=True):
    name: str = Field(index=True, unique=True)
    email: EmailStr = Field(unique=True, index=True, sa_type=AutoString)
    password: str
    password_salt: str
    gender: str = Field(nullable=False)
    current_role_id: UUID = Field(nullable=False)

    last_login_at: Optional[datetime] = None
    last_login_ip: Optional[IPvAnyAddress] = Field(default=None, sa_type=AutoString)
    last_active_at: datetime = Field(
        default_factory=datetime.now,
        nullable=False,
        sa_column_kwargs={
            "server_default": text("current_timestamp(0)"),
        },
    )

    status: str = Field(
        default="active",
        nullable=False,
        sa_column_kwargs={"server_default": text("'active'::character varying")},
    )
    initialized_at: Optional[datetime] = None

    def get_status(self) -> UserStatus:
        status_str = self.status
        return UserStatus(status_str)

    def get_gender(self) -> UserGender:
        return UserGender(self.gender)


class UserRole(BaseSQLModel, RecordeSQLModel, table=True):
    user_id: UUID
    role_id: UUID
