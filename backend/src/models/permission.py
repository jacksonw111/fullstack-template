from enum import Enum
from uuid import UUID
from src.models.base import BaseSQLModel, RecordeSQLModel
from sqlmodel import UniqueConstraint


class PermissionType(str, Enum):
    DASHBOARD_VIEW = "dashboard:view"
    DASHBOARD_ADD = "dashboard:add"
    DASHBOARD_UPDATE = "dashboard:update"
    DASHBOARD_DELETE = "dashboard:delete"
    USER_VIEW = "user:view"
    USER_ADD = "user:add"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    ROLE_VIEW = "role:view"
    ROLE_ADD = "role:add"
    ROLE_UPDATE = "role:update"
    ROLE_DELETE = "role:delete"
    PERMISSION_VIEW = "role:permission:view"
    PERMISSION_ADD = "role:permission:add"
    PERMISSION_DELETE = "role:permission:delete"


class RolePermission(BaseSQLModel, RecordeSQLModel, table=True):
    role_id: UUID
    permission: str

    __table_args__ = (
        UniqueConstraint("role_id", "permission", name="uq_role_permission"),
    )
