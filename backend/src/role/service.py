from uuid import UUID
from fastapi import HTTPException
from sqlmodel import select, func
from src.base.service import BaseService
from src.models.role import Role
from src.role.schema import RoleCreate, RoleUpdate, RoleResponse


class RoleService(BaseService):
    async def create(self, role: RoleCreate) -> RoleResponse:
        db_role = Role(**role.model_dump())
        self.session.add(db_role)
        await self.session.flsuh()
        await self.session.commit()

    async def get_by_id(self, role_id: UUID) -> RoleResponse:
        role = await self.session.get(Role, role_id)
        if not role:
            raise HTTPException(status_code=404, detail="角色未找到")
        return RoleResponse.model_validate(role)

    async def get_all(self, skip: int = 0, limit: int = 10) -> dict:
        query = select(Role).offset(skip).limit(limit)
        result = await self.session.exec(query)
        roles = result.all()
        total = (await self.session.exec(select(func.count()).select_from(Role))).one()
        return {"total": total, "items": roles}

    async def update(self, role_id: UUID, role_update: RoleUpdate) -> RoleResponse:
        db_role = await self.session.get(Role, role_id)
        if not db_role:
            raise HTTPException(status_code=404, detail="角色未找到")

        update_data = role_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_role, key, value)

        await self.session.commit()
        await self.session.refresh(db_role)
        return RoleResponse.model_validate(db_role)

    async def delete(self, role_id: UUID) -> None:
        db_role = await self.session.get(Role, role_id)
        if not db_role:
            raise HTTPException(status_code=404, detail="角色未找到")

        await self.session.delete(db_role)
        await self.session.commit()
