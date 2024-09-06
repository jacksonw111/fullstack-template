from uuid import UUID
from sqlmodel import SQLModel

from src.models.permission import PermissionType


class RolePermissionRequest(SQLModel):
    role_id: UUID
    permission: PermissionType
