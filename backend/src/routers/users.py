from fastapi import APIRouter

from src.deps.db import GetDB

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/")
async def get_users(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute("SELECT * FROM users")
        users = await cur.fetchall()
        return {"users": users}
