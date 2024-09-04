import base64
import logging
import secrets
from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import col, select, func
from src.base.service import BaseService
from src.libs.passport import hash_password
from src.models.role import Role
from src.models.user import User, UserGender, UserRole, UserStatus
from src.user.shema import UserCreate, UserResponse, UserUpdate
from src.conf import settings


class UserService(BaseService):
    async def initialize(self):
        try:

            statement = select(Role).where(Role.name == "SUPER_ADMIN")
            user_role_statement = select(Role).where(Role.name == "USER")

            role = (await self.session.exec(statement)).one_or_none()
            user_role = (await self.session.exec(user_role_statement)).one_or_none()

            if user_role is None:
                user_role = Role(name="USER")
                self.session.add(user_role)
                await self.session.flush()

            if role is None:
                role = Role(name="SUPER_ADMIN")
                self.session.add(role)
                await self.session.flush()

            user_statement = (
                select(User)
                .join(UserRole, UserRole.user_id == User.id)
                .where(UserRole.role_id == role.id)
            )

            admin = (await self.session.exec(user_statement)).one_or_none()
            await self.session.commit()

            if admin is None:
                await self.create(
                    UserCreate(
                        name="jackson",
                        password=settings.PASSWORD,
                        email=settings.EMAIL,
                        gender="male",
                        current_role_id=role.id,
                    )
                )

        except Exception as e:
            logging.error(e)

    async def create(self, user_create: UserCreate):
        salt = secrets.token_bytes(16)
        base64_salt = base64.b64encode(salt).decode()
        hashed_password = hash_password(user_create.password, salt)
        base64_password_hashed = base64.b64encode(hashed_password).decode()
        async with self.session.begin():
            user = User(
                name=user_create.name,
                email=user_create.email,
                password=base64_password_hashed,
                password_salt=base64_salt,
                gender=UserGender(user_create.gender),
                status=UserStatus.ACTIVE,
                current_role_id=user_create.current_role_id,
            )
            self.session.add(user)
            await self.session.flush()

            self.session.add(
                UserRole(role_id=user_create.current_role_id, user_id=user.id)
            )
            await self.session.commit()

    async def get_by(self, id: UUID):
        user = await self.session.get(User, id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"user not found. id={id}"
            )
        return user

    async def all(self, name: str = None, skip: int = 0, limit: int = 10):
        statement = select(User)
        total_statement = select(func.count()).select_from(User)
        if name is not None:
            statement = statement.where(col(User.name).like(f"{name}%"))
            total_statement = total_statement.where(col(User.name).like(f"{name}%"))

        statement = statement.offset(skip * limit)
        statement = statement.limit(limit)
        users = (await self.session.exec(statement)).all()
        total = (await self.session.exec(total_statement)).one()
        return {
            "total": total,
            "users": [UserResponse.model_validate(user) for user in users],
        }

    async def update(self, id: UUID, user_update: UserUpdate):
        user = await self.get_by(id)
        for name, value in user_update.model_dump().items():
            setattr(user, name, value)
        await self.session.flush()
        await self.session.commit()

    async def remove(self, id: UUID):
        await self.session.delete(await self.get_by(id))
        await self.session.flush()
        await self.session.commit()
