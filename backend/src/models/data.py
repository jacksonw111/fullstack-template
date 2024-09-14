from datetime import datetime
from sqlmodel import Field
from src.models.base import BaseSQLModel, RecordeSQLModel


class TwitterAuth(BaseSQLModel, table=True):
    username: str = Field(nullable=False, index=True)
    password: str = Field(nullable=False)
    secret: str = Field(nullable=False)
    token: str = Field(nullable=False)


class TwitterSoure(BaseSQLModel, RecordeSQLModel, tbale=True):
    name: str = Field(nullable=False)


class TwitterData(BaseSQLModel, table=True):
    md5 = Field(unique=True, nullable=False)
    content: str = Field(nullable=False)
    comment_number: int = Field(nullable=False)
    forware_number: int = Field(nullable=False)
    likes: int = Field(nullable=False)
    record_date: datetime = Field(nullable=False)
