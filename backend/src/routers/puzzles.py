from fastapi import APIRouter, HTTPException

from src.deps.auth import UserAuth
from src.deps.db import GetDB
from src.model.models import Attempt, Puzzle
from src.model.puzzles import PuzzleUpdate

router = APIRouter(
    prefix="/puzzles",
    tags=["puzzles"],
)


@router.get("/")
async def query_puzzles(db: GetDB, puzzle_name: str, creator_name: str) -> list[Puzzle]:
    raise NotImplementedError("Query puzzles not implemented yet")


@router.get("/recent")
async def get_recent_puzzles(db: GetDB) -> list[Puzzle]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, created_user_id, username, puzzle_name, puzzle_type,
                updated_at, rating_ct, rating_avg, solved_ct
            from puzzle_stats
            order by updated_at desc
            limit 50;
            """
        )
        recent_puzzles = await cur.fetchall()
        return [
            Puzzle(
                puzzle_id=puzzle[0],
                created_user_id=puzzle[1],
                created_username=puzzle[2],
                puzzle_name=puzzle[3],
                puzzle_type=puzzle[4],
                updated_at=puzzle[5],
                rating_ct=puzzle[6],
                rating_avg=puzzle[7],
                solved_ct=puzzle[8],
            )
            for puzzle in recent_puzzles
        ]


@router.get("/popular")  # High rating
async def get_popular_puzzles(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, created_user_id, username, puzzle_name, puzzle_type,
                updated_at, rating_ct, rating_avg, solved_ct
            from puzzle_stats
            where rating_ct > 0
            order by rating_avg desc, updated_at desc
            limit 50;
            """
        )
        popular_puzzles = await cur.fetchall()
        return [
            Puzzle(
                puzzle_id=puzzle[0],
                created_user_id=puzzle[1],
                created_username=puzzle[2],
                puzzle_name=puzzle[3],
                puzzle_type=puzzle[4],
                updated_at=puzzle[5],
                rating_ct=puzzle[6],
                rating_avg=puzzle[7],
                solved_ct=puzzle[8],
            )
            for puzzle in popular_puzzles
        ]


@router.get("/most-played")
async def get_most_played_puzzles(db: GetDB):
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, created_user_id, username, puzzle_name, puzzle_type,
                updated_at, rating_ct, rating_avg, solved_ct
            from puzzle_stats
            order by solved_ct desc, updated_at desc
            limit 50;
            """
        )
        trending_puzzles = await cur.fetchall()
        return [
            Puzzle(
                puzzle_id=puzzle[0],
                created_user_id=puzzle[1],
                created_username=puzzle[2],
                puzzle_name=puzzle[3],
                puzzle_type=puzzle[4],
                updated_at=puzzle[5],
                rating_ct=puzzle[6],
                rating_avg=puzzle[7],
                solved_ct=puzzle[8],
            )
            for puzzle in trending_puzzles
        ]


@router.post("/")
async def create_puzzle(
    db: GetDB,
    user: UserAuth,
    puzzle_name: str,
    puzzle_type: str,
) -> Puzzle:
    async with db.cursor() as cur:
        await cur.execute(
            """
            insert into puzzles (created_user_id, puzzle_name, puzzle_type)
            values (%s, %s, %s)
            returning puzzle_id;
            """,
            (user.user_id, puzzle_name, puzzle_type),
        )
        puzzle_id = await cur.fetchone()
        db.commit()
        if not puzzle_id:
            raise HTTPException(
                status_code=500,
                detail="Failed to create puzzle",
            )
        puzzle_out = await cur.execute(
            """
            select puzzle_id, created_user_id, username, puzzle_name, puzzle_type,
                updated_at, rating_ct, rating_avg, solved_ct
            from puzzle_stats
            where puzzle_id = %s;
            """,
            (puzzle_id,),
        )
        puzzle_out = await cur.fetchone()
        if not puzzle_out:
            raise HTTPException(
                status_code=500,
                detail="Failed to create puzzle",
            )
        return Puzzle(
            puzzle_id=puzzle_out[0],
            created_user_id=puzzle_out[1],
            created_username=puzzle_out[2],
            puzzle_name=puzzle_out[3],
            puzzle_type=puzzle_out[4],
            updated_at=puzzle_out[5],
            rating_ct=puzzle_out[6],
            rating_avg=puzzle_out[7],
            solved_ct=puzzle_out[8],
        )


@router.put("/{puzzle_id}")
async def update_puzzle(
    db: GetDB, user: UserAuth, puzzle_id: int, puzzle_update: PuzzleUpdate
) -> Puzzle:
    raise NotImplementedError("Update puzzle not implemented yet")


@router.delete("/{puzzle_id}")
async def delete_puzzle(db: GetDB, user: UserAuth, puzzle_id: int) -> None:
    raise NotImplementedError("Delete puzzle not implemented yet")


@router.get("/{puzzle_id}")
async def get_puzzle(db: GetDB, puzzle_id: int) -> Puzzle:
    raise NotImplementedError("Get puzzle not implemented yet")


@router.post("/{puzzle_id}/attempt")
async def submit_attempt(
    db: GetDB, user: UserAuth, puzzle_id: int, attempt: str
) -> None:
    raise NotImplementedError("Create attempt not implemented yet")


@router.get("/{puzzle_id}/attempt")
async def get_current_attempt(db: GetDB, user: UserAuth, puzzle_id: int) -> None:
    raise NotImplementedError("Get attempt not implemented yet")


@router.get("/{puzzle_id}/attempts")
async def get_leaderboard(db: GetDB, puzzle_id: int) -> list[Attempt]:
    raise NotImplementedError("Get leaderboard not implemented yet")
