from fastapi import APIRouter

from src.deps.db import GetDB

router = APIRouter(
    prefix="/ratings",
    tags=["ratings"],
)


@router.get("/")
async def get_ratings(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute("SELECT * FROM ratings")
        ratings = await cur.fetchall()
        return {"ratings": ratings}
