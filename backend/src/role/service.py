from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import select, func
from src.base.service import BaseService
from src.models.permission import PermissionType, RolePermission
from src.models.role import Role
from src.role.schema import RoleCreate, RoleUpdate, RoleResponse


class RoleService(BaseService):
    async def create(self, role: RoleCreate) -> RoleResponse:
        async with self.session.begin():
            db_role = Role(name=role.name)
            self.session.add(db_role)
            await self.session.flush()
            permissions = []
            for permission in role.permissions:
                permissions.append(
                    RolePermission(
                        role_id=db_role.id, permission=PermissionType(permission)
                    )
                )

            self.session.add_all(permissions)
            await self.session.flush()
            await self.session.commit()

    async def get_by_id(self, role_id: UUID) -> RoleResponse:
        role = await self.session.get(Role, role_id)
        if not role:
            raise HTTPException(status_code=404, detail="角色未找到")
        return RoleResponse.model_validate(role)

    async def get_role_permission_by_id(self, role_id: UUID) -> RoleResponse:
        role = await self.session.get(Role, role_id)
        if not role:
            raise HTTPException(status_code=404, detail="角色未找到")
        permissions = await self.session.exec(
            select(RolePermission).where(RolePermission.role_id == role_id)
        )
        return RoleResponse(
            id=role.id,
            name=role.name,
            permissions=[permission.permission for permission in permissions],
        )

    async def get_all(self, skip: int = 0, limit: int = 10) -> dict:
        query = select(Role).offset(skip * limit).limit(limit)
        result = await self.session.exec(query)
        roles = result.all()
        total = (await self.session.exec(select(func.count()).select_from(Role))).one()
        return {"total": total, "items": roles}

    async def update(self, role_id: UUID, role_update: RoleUpdate) -> RoleResponse:
        async with self.session.begin():
            db_role = await self.session.get(Role, role_id)
            if not db_role:
                raise HTTPException(status_code=404, detail="角色未找到")

            update_data = role_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if hasattr(db_role, key):
                    setattr(db_role, key, value)

            for permission in role_update.permissions:
                statement = (
                    insert(RolePermission)
                    .values(role_id=role_id, permission=PermissionType(permission))
                    .on_conflict_do_update(
                        constraint="uq_role_permission",
                        set_={"permission": PermissionType(permission)},
                    )
                )
                await self.session.exec(statement)

            await self.session.refresh(db_role)
            await self.session.commit()

    async def delete(self, role_id: UUID) -> None:
        db_role = await self.session.get(Role, role_id)
        if not db_role:
            raise HTTPException(status_code=404, detail="角色未找到")

        await self.session.delete(db_role)
        await self.session.commit()
