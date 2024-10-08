from src.main import app
from src.user.router import api as user_api
from src.role.router import api as role_api
from src.auth.router import api as auth_api
from src.permissions.router import api as permission_api

app.include_router(auth_api)
app.include_router(role_api)
app.include_router(user_api, tags=["user"])
app.include_router(permission_api, tags=["permissions"])
