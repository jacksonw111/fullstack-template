from typing import Annotated

from fastapi import Depends
from redis import Redis

# from redis import Redis

from src.extensions import Extensions
from sqlmodel.ext.asyncio.session import AsyncSession


class BaseService:
    def __init__(
        self,
        session: Annotated[AsyncSession, Depends(Extensions.db)],
        redis: Annotated[Redis, Depends(Extensions.redis)],
    ) -> None:
        self.session = session
        self.redis = redis
