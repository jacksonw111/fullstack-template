from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from src.auth.schema import LogoutRequest, RefreshToken

from src.auth.service import AuthService, get_current_active_user
from src.models.user import User


api = APIRouter()


@api.post("/token")
async def token(
    service: Annotated[AuthService, Depends()],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    return await service.authenticate(form_data.username, form_data.password)


@api.post("/refresh")
async def refresh(
    refresh_token: RefreshToken, service: Annotated[AuthService, Depends()]
):
    return await service.refresh_token(refresh_token)


@api.put("/logout")
async def logout(
    logout_request: LogoutRequest, service: Annotated[AuthService, Depends()]
):
    await service.logout(logout_request.access_token, logout_request.refresh_token)


@api.get("/current-account")
async def get_current_account(
    current_account: Annotated[User, Depends(get_current_active_user)]
):
    return current_account
