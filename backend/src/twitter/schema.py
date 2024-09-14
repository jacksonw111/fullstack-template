from sqlmodel import SQLModel


class TwitterCookieSchema(SQLModel):
    cookies: str
    username: str
    token: str
