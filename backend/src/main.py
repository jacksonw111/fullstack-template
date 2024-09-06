from contextlib import asynccontextmanager
import logging
import secrets
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.dialects.postgresql import insert
from sqlmodel.ext.asyncio.session import AsyncSession

from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from src.models.permission import PermissionType, RolePermission
from src.user.service import UserService
from src.extensions import Extensions


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s - %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("start application")
    session: AsyncSession = None
    try:
        session = await anext(Extensions.db(False))
        role_id = await UserService(session, None).initialize()
        logging.info(f"role_id:{role_id}")

        # 预置 RolePermission 数据
        permissions = [
            {"role_id": role_id, "permission": permission}
            for permission in PermissionType
        ]

        stmt = insert(RolePermission).values(permissions)
        stmt = stmt.on_conflict_do_nothing(index_elements=["role_id", "permission"])

        await session.exec(stmt)
        await session.commit()

        logging.info("已成功预置 RolePermission 数据")
        # 启动调度器
        # scheduler.start()
    except Exception as e:
        logging.error(e)
    finally:
        if session is not None:
            await session.close()
    yield
    logging.info("shutdown application")
    # scheduler.shutdown()


# add basic auth to see the docs
security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "digital")
    correct_password = secrets.compare_digest(credentials.password, "4A0593f4c")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None, lifespan=lifespan)


@app.get("/docs")
async def get_documentation(username: str = Depends(get_current_username)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.get("/openapi.json")
async def openapi(username: str = Depends(get_current_username)):
    return get_openapi(
        title="FastAPI", version="0.1.0", routes=app.routes, openapi_version="3.1.0"
    )


from src.routes import *  # noqa
