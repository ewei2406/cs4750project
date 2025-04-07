from typing import Annotated

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBasic

from src.deps.db import GetDB
from src.model.models import User

security = HTTPBasic()


async def auth_user(
    db: GetDB, credentials: HTTPAuthorizationCredentials = Security(security)
) -> User:
    username = credentials.username
    password = credentials.password

    async with db.cursor() as cur:
        await cur.execute(
            "SELECT user_id, username, is_admin FROM users WHERE username = %s AND password = %s",
            (username, password),
        )
        user = await cur.fetchone()
        if user:
            return User(
                user_id=user[0],
                username=user[1],
                is_admin=user[2],
            )
        else:
            raise HTTPException(
                status_code=401,
                detail="Not authorized",
            )


UserAuth = Annotated[User, Depends(auth_user)]
