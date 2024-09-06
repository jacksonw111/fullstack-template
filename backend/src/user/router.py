from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends

from src.models.permission import PermissionType
from src.permissions.service import PermissionsDependency
from src.user.service import UserService
from src.user.shema import UserCreate, UserUpdate


api = APIRouter(prefix="/users")


@api.post("")
async def create(
    service: Annotated[UserService, Depends()],
    user_create: UserCreate,
    _=Depends(
        PermissionsDependency({PermissionType.USER_VIEW, PermissionType.USER_ADD})
    ),
):
    await service.create(user_create)


@api.get("/{user_id}")
async def get(
    user_id: UUID,
    service: Annotated[UserService, Depends()],
    _=Depends(PermissionsDependency({PermissionType.USER_VIEW})),
):
    return await service.get_by(user_id)


@api.put("/{user_id}")
async def update(
    user_id: UUID,
    user_update: UserUpdate,
    service: Annotated[UserService, Depends()],
    _=Depends(
        PermissionsDependency({PermissionType.USER_VIEW, PermissionType.USER_UPDATE})
    ),
):
    await service.update(user_update=user_update, user_id=user_id)


@api.delete("/{user_id}")
async def remove(
    user_id: UUID,
    service: Annotated[UserService, Depends()],
    _=Depends(
        PermissionsDependency({PermissionType.USER_VIEW, PermissionType.USER_DELETE})
    ),
):
    await service.remove(user_id=user_id)


@api.get("")
async def all(
    service: Annotated[UserService, Depends()],
    name: str = None,
    skip: int = 0,
    limit: int = 10,
    _=Depends(PermissionsDependency({PermissionType.USER_VIEW})),
):
    return await service.all(name=name, skip=skip, limit=limit)
