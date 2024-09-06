from uuid import UUID
from fastapi import Depends, HTTPException
from redis import Redis
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth.schema import CurrentUser
from src.auth.service import get_current_active_user
from src.base.service import BaseService
from src.extensions import Extensions
from src.models.permission import PermissionType, RolePermission
from src.models.role import Role
from src.permissions.schema import RolePermissionRequest


class PermissionsDependency(object):
    def __init__(self, permissions: set[PermissionType]):
        self.permissions = permissions

    def __call__(self, user=Depends(get_current_active_user)):
        if not self.permissions.issubset(user.permissions):
            raise HTTPException(status_code=401, detail="permission deny")


class RolePermissionService(BaseService):
    def __init__(
        self,
        session: AsyncSession = Depends(Extensions.db),
        redis: Redis = Depends(Extensions.redis),
        user: CurrentUser = Depends(get_current_active_user),
    ) -> None:
        super().__init__(session, redis)
        self.user = user

    def get_permissions(self):
        return [permission for permission in PermissionType]

    async def create(
        self,
        role_permission_request: RolePermissionRequest,
    ):
        self.session.add(RolePermission(**role_permission_request.model_dump()))
        await self.session.flush()
        await self.session.commit()

    async def remove(self, id: UUID):
        statement = (
            select(RolePermission, Role)
            .join(Role, RolePermission.role_id == Role.id)
            .where(RolePermission.id == id)
        )
        result = await self.session.exec(statement)
        role_permission, role = result.first()

        if not role_permission:
            raise HTTPException(status_code=404, detail=f"未找到权限。id={id}")

        if role and role.name == "SUPER_ADMIN":
            raise HTTPException(status_code=403, detail="无法删除超级管理员权限")

        await self.session.delete(role_permission)
        await self.session.commit()

    async def get_permissions_by_role(self, role_id: UUID):
        return (
            await self.session.exec(
                select(RolePermission).where(RolePermission.role_id == role_id)
            )
        ).all()
