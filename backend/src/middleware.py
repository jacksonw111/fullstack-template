import logging
from src.main import app
from fastapi import Request


@app.middleware("http")
async def middleware(request: Request, callnext):
    if request.url.path.endswith(
        ("/docs", "/token", "/refresh", "/logout", "/current_account")
    ):
        callnext(request)

    logging.info("middleware")
