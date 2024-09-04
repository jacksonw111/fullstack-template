from typing import List
from uuid import UUID
from sqlmodel import SQLModel


class RoleBase(SQLModel):
    name: str
    permissions: List[UUID]


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    pass


class RoleResponse(RoleBase):
    id: UUID


class RolePermissionUpdate(SQLModel):
    pass
