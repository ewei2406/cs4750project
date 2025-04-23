from typing import Annotated

from fastapi import Depends, Header, HTTPException

from src.deps.db import GetDB
from src.model.models import User


async def auth_user(
    db: GetDB,
    x_username: Annotated[str, Header()],
    x_password: Annotated[str, Header()],
) -> User:
    username = x_username
    password = x_password

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


async def optional_user(
    db: GetDB,
    x_username: Annotated[str | None, Header()] = None,
    x_password: Annotated[str | None, Header()] = None,
) -> User | None:
    if x_username is None or x_password is None:
        return None

    async with db.cursor() as cur:
        await cur.execute(
            "SELECT user_id, username, is_admin FROM users WHERE username = %s AND password = %s",
            (x_username, x_password),
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


UserOptional = Annotated[User | None, Depends(optional_user)]
