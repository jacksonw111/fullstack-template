from sqlmodel import Field

from src.models.base import BaseSQLModel, RecordeSQLModel


class Role(BaseSQLModel, RecordeSQLModel, table=True):
    name: str = Field(index=True, nullable=False, unique=True)
