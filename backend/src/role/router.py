from fastapi import APIRouter, Depends
from uuid import UUID
from src.role.service import RoleService
from src.role.schema import RoleCreate, RoleUpdate, RoleResponse

api = APIRouter(prefix="/roles", tags=["角色"])


@api.post("")
async def create_role(role: RoleCreate, service: RoleService = Depends()):
    await service.create(role)


@api.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: UUID, service: RoleService = Depends()):
    return await service.get_role_permission_by_id(role_id)


@api.get("", response_model=dict)
async def list_roles(skip: int = 0, limit: int = 10, service: RoleService = Depends()):
    return await service.get_all(skip=skip, limit=limit)


@api.put("/{role_id}")
async def update_role(
    role_id: UUID, role: RoleUpdate, service: RoleService = Depends()
):
    await service.update(role_id, role)


@api.delete("/{role_id}")
async def delete_role(role_id: UUID, service: RoleService = Depends()):
    return await service.delete(role_id)
