from datetime import datetime
from uuid import UUID
from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserSchema(SQLModel):
    name: str = Field(
        regex=r"^[a-zA-Z0-9_-]{3,16}$",
        description="用户名必须是3-16个字符，只能包含字母、数字、下划线和连字符",
    )
    gender: str
    email: EmailStr = Field(description="必须是有效的电子邮件地址")
    password: str = Field(min_length=8, description="密码长度必须至少为8个字符")
    current_role_id: UUID


class UserCreate(UserSchema):
    pass


class UserUpdate(SQLModel):
    name: str | None = None
    email: str | None = None
    password: str | None = None


class UserResponse(SQLModel):
    id: UUID
    name: str
    email: str
    status: str
    created_at: datetime
    updated_at: datetime
