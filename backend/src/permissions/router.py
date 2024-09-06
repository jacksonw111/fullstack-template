from uuid import UUID
from fastapi import APIRouter, Depends

from src.permissions.schema import RolePermissionRequest
from src.permissions.service import RolePermissionService


api = APIRouter()


@api.get("/permissions")
async def get_permissions(service: RolePermissionService = Depends()):
    return service.get_permissions()


@api.post("/permissions")
async def create_role_permissions(
    role_permission_request: RolePermissionRequest,
    service: RolePermissionService = Depends(),
):
    await service.create(role_permission_request)


@api.delete("/permissions/{id}")
async def remove_role_permission(id: UUID, service: RolePermissionService = Depends()):
    await service.remove(id)
