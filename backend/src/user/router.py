from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends

from src.user.service import UserService
from src.user.shema import UserCreate, UserUpdate


api = APIRouter(prefix="/users")


@api.post("")
async def create(service: Annotated[UserService, Depends()], user_create: UserCreate):
    await service.create(user_create)


@api.get("/{user_id}")
async def get(user_id: UUID, service: Annotated[UserService, Depends()]):
    return await service.get_by(user_id)


@api.put("/{user_id}")
async def update(
    user_id: UUID, user_update: UserUpdate, service: Annotated[UserService, Depends()]
):
    await service.update(user_update=user_update, user_id=user_id)


@api.delete("/{user_id}")
async def remove(user_id: UUID, service: Annotated[UserService, Depends()]):
    await service.remove(user_id=user_id)


@api.get("")
async def all(
    service: Annotated[UserService, Depends()],
    name: str = None,
    skip: int = 0,
    limit: int = 10,
):
    return await service.all(name=name, skip=skip, limit=limit)
