from enum import Enum
from sqlmodel import Field
from src.models.base import BaseSQLModel, RecordeSQLModel


class MenuType(str, Enum):
    MENU = "menu"
    SUB_MENU = "sub_menu"


class Menu(BaseSQLModel, RecordeSQLModel, table=True):
    name: str = Field(nullable=False)
    icon: str = Field(nullable=False)
    route: str = Field(nullable=True)
    file_path: str = Field(nullable=False)
    type: MenuType = Field(nullable=False)
