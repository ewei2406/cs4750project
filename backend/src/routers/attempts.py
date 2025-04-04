from fastapi import APIRouter

from src.deps.db import GetDB

router = APIRouter(
    prefix="/attempts",
    tags=["attempts"],
)


@router.get("/")
async def get_attempts(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute("SELECT * FROM attempts")
        attempts = await cur.fetchall()
        return {"attempts": attempts}
