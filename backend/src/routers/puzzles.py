from fastapi import APIRouter

from src.deps.db import GetDB

router = APIRouter(
    prefix="/puzzles",
    tags=["puzzles"],
)


@router.get("/")
async def get_puzzles(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute("SELECT * FROM puzzles")
        puzzles = await cur.fetchall()
        return {"puzzles": puzzles}
