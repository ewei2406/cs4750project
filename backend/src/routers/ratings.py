from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from src.deps.auth import UserAuth
from src.deps.db import GetDB
from src.model.models import Rating

router = APIRouter(
    prefix="/ratings",
    tags=["ratings"],
)


@router.get("/")
async def get_rating(db: GetDB, user: UserAuth, puzzle_id: int) -> Rating:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, user_id, username, puzzle_name, puzzle_type, rating, updated_at
            from rating_stats
            where puzzle_id = %s and user_id = %s
            """,
            (puzzle_id, user.user_id),
        )
        rating_out = await cur.fetchone()
        if not rating_out:
            raise HTTPException(
                status_code=404,
                detail="Rating not found.",
            )
        return Rating(
            puzzle_id=rating_out[0],
            user_id=rating_out[1],
            username=rating_out[2],
            puzzle_name=rating_out[3],
            puzzle_type=rating_out[4],
            rating=rating_out[5],
            updated_at=rating_out[6],
        )


@router.post("/")
async def set_rating(
    db: GetDB, user: UserAuth, puzzle_id: int, rating: Annotated[int, Query(ge=0, le=5)]
) -> Rating:
    async with db.cursor() as cur:
        try:
            await cur.execute(
                """
                insert into ratings (user_id, puzzle_id, rating)
                values (%s, %s, %s)
                on conflict (user_id, puzzle_id) do update
                set rating = excluded.rating, updated_at = now();
                """,
                (user.user_id, puzzle_id, rating),
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail="Failed to set rating.",
            ) from e

        await cur.execute(
            """
            select puzzle_id, user_id, username, puzzle_name, puzzle_type, rating, updated_at
            from rating_stats
            where puzzle_id = %s and user_id = %s
            """,
            (puzzle_id, user.user_id),
        )
        rating_out = await cur.fetchone()
        if not rating_out:
            raise HTTPException(
                status_code=500,
                detail="Failed to create rating",
            )
        await db.commit()
        return Rating(
            puzzle_id=rating_out[0],
            user_id=rating_out[1],
            username=rating_out[2],
            puzzle_name=rating_out[3],
            puzzle_type=rating_out[4],
            rating=rating_out[5],
            updated_at=rating_out[6],
        )


@router.delete("/")
async def delete_rating(db: GetDB, user: UserAuth, puzzle_id: int) -> str:
    async with db.cursor() as cur:
        await cur.execute(
            """
            delete from ratings
            where user_id = %s and puzzle_id = %s
            """,
            (user.user_id, puzzle_id),
        )
        return "Rating deleted"
