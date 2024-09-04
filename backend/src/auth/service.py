import base64
from datetime import datetime, timedelta
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlmodel import select
from src.auth.schema import CurrentUserResponse, RefreshToken
from src.libs.passport import verify_password
from src.base.service import BaseService
from src.conf import settings
from passlib.context import CryptContext

from src.models.role import Role
from src.models.user import User, UserStatus

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthService(BaseService):
    def __generate_token(self, data: dict, expires_delta: timedelta):
        to_encode = data.copy()
        exp = datetime.now() + expires_delta
        to_encode.update({"exp": exp})
        encoded_jwt = jwt.encode(
            payload=to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM
        )
        return encoded_jwt

    def verify_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌已过期"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="无效的令牌"
            )

    def generate_access_token(self, user_id: UUID) -> str:
        payload = {
            "user_id": str(user_id),
            "iss": settings.ISS,
            "sub": settings.SUB,
        }

        return self.__generate_token(
            data=payload,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE),
        )

    def generate_refresh_token(self, user_id: UUID) -> str:
        payload = {
            "user_id": str(user_id),
            "iss": settings.ISS,
            "sub": settings.SUB,
        }
        return self.__generate_token(
            data=payload,
            expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE),
        )

    async def authenticate(self, email: str, password: str) -> User:
        statement = select(User).where(User.email == email)
        user = (await self.session.exec(statement)).one_or_none()
        if not user:
            raise HTTPException(
                status_code=404, detail=f"user not found. email={email}"
            )

        if user.get_status() != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=401,
                detail=f"""
                You don't have permission to visit this site.
                Your user has been : {user.get_status()}""",
            )
        salt = base64.b64decode(user.password_salt)
        if not verify_password(password, user.password, salt):
            raise HTTPException(
                status_code=401, detail=f"authenticate failed. email={email}"
            )

        access_token = self.generate_access_token(user.id)
        refresh_token = self.generate_refresh_token(user.id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    async def invalidate_token(self, token: str, expire_in: int = 3600):
        """将令牌添加到黑名单"""
        await self.redis.setex(f"blacklist:{token}", expire_in, "1")

    async def is_token_blacklisted(self, token: str) -> bool:
        """检查令牌是否在黑名单中"""
        return await self.redis.exists(f"blacklist:{token}")

    async def invalidate_refresh_token(
        self, refresh_token: str, expire_in: int = 604800
    ):
        """将刷新令牌添加到黑名单"""
        await self.redis.setex(f"refresh_blacklist:{refresh_token}", expire_in, "1")

    async def is_refresh_token_blacklisted(self, refresh_token: str) -> bool:
        """检查刷新令牌是否在黑名单中"""
        return await self.redis.exists(f"refresh_blacklist:{refresh_token}")

    async def logout(self, access_token: str, refresh_token: str):
        if not await self.is_token_blacklisted(access_token):
            self.invalidate_token(access_token)

        if not await self.is_refresh_token_blacklisted(refresh_token):
            self.invalidate_refresh_token(refresh_token)

    async def refresh_token(self, refresh_token: RefreshToken):
        if await self.is_refresh_token_blacklisted(refresh_token.refresh_token):
            raise HTTPException(status_code=401, detail="invalid refresh_token")
        payload = self.verify_token(refresh_token.refresh_token)
        user_id = payload.get("user_id")
        user = await self.session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="invalid refresh_token")
        if user.get_status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=401, detail=f"Your user has been: {user.get_status()}"
            )

        return {
            "access_token": self.generate_access_token(user.id),
            "token_type": "bearer",
        }

    async def get_user_by_id(self, user_id: str):
        statement = (
            select(User, Role)
            .join(Role, Role.id == User.current_role_id)
            .where(User.id == user_id)
        )
        user_role = (await self.session.exec(statement)).one_or_none()

        if not user_role:
            raise HTTPException(status_code=404, detail=f"user not found. id={user_id}")
        user, role = user_role
        return CurrentUserResponse(**user.model_dump(), current_role=role)


async def get_current_active_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(),
):
    if await auth_service.is_token_blacklisted(token):
        raise HTTPException(status_code=401, detail="Invalid access token")

    try:
        payload = auth_service.verify_token(token)
        user_id = payload.get("user_id")

        user: User = await auth_service.get_user_by_id(user_id)

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="无效的认证凭据")
