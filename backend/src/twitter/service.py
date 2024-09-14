from sqlalchemy import JSON
from src.base.service import BaseService
from src.twitter.schema import TwitterCookieSchema


class TwitterService(BaseService):
    async def store_cookies(self, schema: TwitterCookieSchema):
        await self.redis.setex(
            name=schema.username,
            value=JSON.dumps(schema.model_dump()),
            ex=60 * 60 * 24 * 300,
        )
