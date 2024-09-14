from functools import lru_cache
import os
from typing import Any, Optional
from pydantic import (
    EmailStr,
    PostgresDsn,
    RedisDsn,
    ValidationInfo,
    field_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Setting(BaseSettings):
    # default admin
    NAME: str
    EMAIL: EmailStr
    PASSWORD: str
    EXP_DAYS: int
    ISS: str
    SUB: str

    # twitter
    TWITTER_BASE_URL: str = "https://x.com/i/api"

    # APIKEY for connection
    APIKEY: str
    LLM_API_URL: str
    MASTER_AGENT: str
    OPEN_AI_KEY: str

    # to get a string like this run:
    # openssl rand -hex 32
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE: int
    REFRESH_TOKEN_EXPIRE: int

    # POSTGRES
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    ASYNC_SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None
    SQLALCHEMY_POOL_SIZE: int = 50
    SQLALCHEMY_POOL_PRE_PING: bool = False
    SQLALCHEMY_POOL_RECYCLE: int = 300
    SQLALCHEMY_ECHO: bool = False

    @field_validator("ASYNC_SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_async_db_connection(
        cls, v: Optional[str], values: ValidationInfo
    ) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.data.get("POSTGRES_USER"),
            password=values.data.get("POSTGRES_PASSWORD"),
            host=values.data.get("POSTGRES_SERVER"),
            path=f"{values.data.get('POSTGRES_DB') or ''}",
        )

    # REDIS
    REDIS_SERVER: str
    REDIS_PASSWORD: str
    REDIS_DB: int = 0
    REDIS_URI: Optional[RedisDsn] = None

    @field_validator("REDIS_URI", mode="before")
    def assemble_redis_connection(
        cls, v: Optional[str], values: ValidationInfo
    ):  # noqa
        if isinstance(v, str):
            return v
        return RedisDsn.build(
            scheme="redis",
            password=values.data.get("REDIS_PASSWORD"),
            host=values.data.get("REDIS_SERVER"),
            path=f"{values.data.get('REDIS_DB') or ''}",
        )


class DevSetting(Setting):
    model_config = SettingsConfigDict(env_file=".env.dev")


class ProSetting(Setting):
    model_config = SettingsConfigDict(env_file=".env.prod")


@lru_cache
def get_config():
    if os.getenv("ENV").upper() == "DEV":
        return DevSetting()
    else:
        return ProSetting()


settings = get_config()
