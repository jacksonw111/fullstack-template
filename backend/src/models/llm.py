from enum import Enum
from sqlmodel import Field
from src.models.base import BaseSQLModel, RecordeSQLModel


class APIType(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    COHERE = "cohere"
    GOOGLE = "google"
    HUGGINGFACE = "huggingface"
    DIFY = "dify"
    DEEPSEEK = "deepseek"
    GROQ = "groq"
    JUST_SAY_AI = "just-say-ai"


class LLM(BaseSQLModel, RecordeSQLModel, table=True):
    name: str = Field(nullable=False, index=True, unique=True)
    description: str = Field(nullable=True)
    model: str = Field(nullable=False)
    api_key: str = Field(nullable=False)
    base_url: str = Field(nullable=False)
    response_format: str = Field(nullable=False)
    timeout: int = Field(nullable=False)
    api_type: str = Field(nullable=False)
    max_tokens: int = Field(nullable=False)
    top_p: float = Field(nullable=False)
    frequency_penalty: float = Field(nullable=False)
    presence_penalty: float = Field(nullable=False)
    cache_seed: int = Field(nullable=False)
    temperature: float = Field(nullable=False, default=0.1)
