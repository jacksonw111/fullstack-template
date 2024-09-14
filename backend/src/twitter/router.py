from typing import Annotated
from fastapi import APIRouter, Depends

from src.twitter.schema import TwitterCookieSchema
from src.twitter.service import TwitterService


api = APIRouter(prefix="/twitter")


@api.post("/cookies")
async def store_cookies(
    schema: TwitterCookieSchema, service: Annotated[TwitterService, Depends()]
):
    await service.store_cookies(schema)
