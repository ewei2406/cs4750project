import json
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, HTTPException

from src.deps.auth import UserAuth
from src.deps.db import GetDB
from src.model.models import Attempt, PuzzleStats
from src.model.puzzles import (
    Connection,
    ConnectionDiscrim,
    Mini,
    MiniDiscrim,
    Puzzle,
    PuzzleUpdate,
)
from src.util import match_connections, match_mini

router = APIRouter(
    prefix="/puzzles",
    tags=["puzzles"],
)


@router.get("/")
async def query_puzzles(
    db: GetDB, puzzle_name: str, creator_name: str
) -> list[PuzzleStats]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, created_user_id, username, puzzle_name, puzzle_type,
                updated_at, rating_ct, rating_avg, solved_ct
            from puzzle_stats
            where puzzle_name like %s and username like %s
            order by updated_at desc;
            """,
            (f"%{puzzle_name}%", f"%{creator_name}%"),
        )
        puzzles = await cur.fetchall()
        return [
            PuzzleStats(
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
            for puzzle in puzzles
        ]


@router.get("/recent")
async def get_recent_puzzles(db: GetDB) -> list[PuzzleStats]:
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
            PuzzleStats(
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
            PuzzleStats(
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
            PuzzleStats(
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
    puzzle_type: Literal["mini", "connections"],
) -> int:
    async with db.cursor() as cur:
        await cur.execute(
            """
            insert into puzzles (created_user_id, puzzle_name, puzzle_type)
            values (%s, %s, %s)
            returning puzzle_id;
            """,
            (
                user.user_id,
                puzzle_name,
                puzzle_type,
            ),
        )
        puzzle_id = await cur.fetchone()
        if not puzzle_id:
            raise HTTPException(
                status_code=500,
                detail="Failed to create puzzle",
            )
        puzzle_id: int = puzzle_id[0]

        if puzzle_type == "mini":
            await cur.execute(
                """
                select puzzle_id, solution, 
                    across1, across2, across3, across4, across5,
                    down1, down2, down3, down4, down5
                from Minis
                where puzzle_id = %s;
                """,
                (puzzle_id,),
            )
            puzzle_data = await cur.fetchone()
            if not puzzle_data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to fetch puzzle data",
                )
            puzzle_data = MiniDiscrim(
                type="mini",
                data=Mini(
                    solution=puzzle_data[1],
                    across1=puzzle_data[2],
                    across2=puzzle_data[3],
                    across3=puzzle_data[4],
                    across4=puzzle_data[5],
                    across5=puzzle_data[6],
                    down1=puzzle_data[7],
                    down2=puzzle_data[8],
                    down3=puzzle_data[9],
                    down4=puzzle_data[10],
                    down5=puzzle_data[11],
                ),
            )
        elif puzzle_type == "connections":
            await cur.execute(
                """
                select puzzle_id, solution,
                    category1, category2, category3, category4,
                from Connections
                where puzzle_id = %s;
                """,
                (puzzle_id,),
            )
            puzzle_data = await cur.fetchone()
            if not puzzle_data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to fetch puzzle data",
                )
            puzzle_data = ConnectionDiscrim(
                type="connections",
                data=Connection(
                    solution=puzzle_data[1],
                    category1=puzzle_data[2],
                    category2=puzzle_data[3],
                    category3=puzzle_data[4],
                    category4=puzzle_data[5],
                ),
            )
    return puzzle_id


@router.put("/{puzzle_id}")
async def update_puzzle(
    db: GetDB, user: UserAuth, puzzle_id: int, puzzle_update: PuzzleUpdate
) -> Puzzle:
    async with db.cursor() as cur:
        await cur.execute(
            """
            update puzzles
            set puzzle_name = %s,
                puzzle_type = %s
            where puzzle_id = %s and created_user_id = %s;
            """,
            (
                puzzle_update.puzzle_name,
                puzzle_update.puzzle_data.type,
                puzzle_id,
                user.user_id,
            ),
        )
        if cur.rowcount == 0:
            await db.rollback()
            raise HTTPException(
                status_code=404,
                detail="Puzzle not found or not created by user",
            )

        if isinstance(puzzle_update.puzzle_data, MiniDiscrim):
            await cur.execute(
                """
                update Minis
                set solution = %s,
                    across1 = %s,
                    across2 = %s,
                    across3 = %s,
                    across4 = %s,
                    across5 = %s,
                    down1 = %s,
                    down2 = %s,
                    down3 = %s,
                    down4 = %s,
                    down5 = %s
                where puzzle_id = %s;
                """,
                (
                    puzzle_update.puzzle_data.data.solution,
                    puzzle_update.puzzle_data.data.across1,
                    puzzle_update.puzzle_data.data.across2,
                    puzzle_update.puzzle_data.data.across3,
                    puzzle_update.puzzle_data.data.across4,
                    puzzle_update.puzzle_data.data.across5,
                    puzzle_update.puzzle_data.data.down1,
                    puzzle_update.puzzle_data.data.down2,
                    puzzle_update.puzzle_data.data.down3,
                    puzzle_update.puzzle_data.data.down4,
                    puzzle_update.puzzle_data.data.down5,
                    puzzle_id,
                ),
            )
        elif isinstance(puzzle_update.puzzle_data, ConnectionDiscrim):
            await cur.execute(
                """
                update Connections
                set solution = %s,
                    category1 = %s,
                    category2 = %s,
                    category3 = %s,
                    category4 = %s
                where puzzle_id = %s;
                """,
                (
                    puzzle_update.puzzle_data.data.solution,
                    puzzle_update.puzzle_data.data.category1,
                    puzzle_update.puzzle_data.data.category2,
                    puzzle_update.puzzle_data.data.category3,
                    puzzle_update.puzzle_data.data.category4,
                    puzzle_id,
                ),
            )
        else:
            await db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Invalid puzzle data",
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
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Failed to update puzzle",
            )

        await db.commit()
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
            puzzle_data=puzzle_update.puzzle_data,
        )


@router.delete("/{puzzle_id}")
async def delete_puzzle(db: GetDB, user: UserAuth, puzzle_id: int) -> None:
    async with db.cursor() as cur:
        if user.is_admin:
            # Admin can delete any puzzle
            await cur.execute(
                """
                delete from puzzles
                where puzzle_id = %s;
                """,
                (puzzle_id,),
            )
        else:
            await cur.execute(
                """
                delete from puzzles
                where puzzle_id = %s and created_user_id = %s;
                """,
                (puzzle_id, user.user_id),
            )
        if cur.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Puzzle not found or not created by user",
            )
        await db.commit()


@router.get("/{puzzle_id}")
async def get_puzzle(db: GetDB, puzzle_id: int) -> Puzzle:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select 
                P.puzzle_type, P.puzzle_id, P.created_user_id, P.username, P.puzzle_name,
                P.updated_at, P.rating_ct, P.rating_avg, P.solved_ct, 
                M.solution as MiniSolution, 
                M.across1, M.across2, M.across3, M.across4, M.across5,
                M.down1, M.down2, M.down3, M.down4, M.down5,
                C.solution as ConnectionSolution,
                C.category1, C.category2, C.category3, C.category4
            from puzzle_stats P
            left join Minis M on P.puzzle_type = 'mini' and P.puzzle_id = M.puzzle_id
            left join Connections C on P.puzzle_type = 'connections' and P.puzzle_id = C.puzzle_id
            where P.puzzle_id = %s;
            """,
            (puzzle_id,),
        )
        puzzle_out = await cur.fetchone()
        if not puzzle_out:
            raise HTTPException(
                status_code=404,
                detail="Puzzle not found",
            )
        puzzle_type = puzzle_out[0]
        if puzzle_type == "mini":
            puzzle_data = MiniDiscrim(
                type="mini",
                data=Mini(
                    solution=puzzle_out[9],
                    across1=puzzle_out[10],
                    across2=puzzle_out[11],
                    across3=puzzle_out[12],
                    across4=puzzle_out[13],
                    across5=puzzle_out[14],
                    down1=puzzle_out[15],
                    down2=puzzle_out[16],
                    down3=puzzle_out[17],
                    down4=puzzle_out[18],
                    down5=puzzle_out[19],
                ),
            )
        elif puzzle_type == "connections":
            puzzle_data = ConnectionDiscrim(
                type="connections",
                data=Connection(
                    solution=puzzle_out[20],
                    category1=puzzle_out[21],
                    category2=puzzle_out[22],
                    category3=puzzle_out[23],
                    category4=puzzle_out[24],
                ),
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Invalid puzzle type",
            )

        return Puzzle(
            puzzle_id=puzzle_out[1],
            created_user_id=puzzle_out[2],
            created_username=puzzle_out[3],
            puzzle_name=puzzle_out[4],
            puzzle_type=puzzle_type,
            updated_at=puzzle_out[5],
            rating_ct=puzzle_out[6],
            rating_avg=puzzle_out[7],
            solved_ct=puzzle_out[8],
            puzzle_data=puzzle_data,
        )


@router.post("/{puzzle_id}/attempt")
async def submit_attempt(
    db: GetDB, user: UserAuth, puzzle_id: int, attempt: str
) -> Attempt:
    async with db.cursor() as cur:
        # The user should not have already completed the puzzle
        await cur.execute(
            """
            select solved
            from Attempts
            where user_id = %s and puzzle_id = %s;
            """,
            (user.user_id, puzzle_id),
        )
        attempt_out = await cur.fetchone()
        if attempt_out and attempt_out[0]:
            raise HTTPException(
                status_code=400,
                detail="Puzzle already solved",
            )

        await cur.execute(
            """
            select 
                P.puzzle_type, P.puzzle_name,
                M.solution as MiniSolution,
                C.solution as ConnectionSolution,
                C.category1, C.category2, C.category3, C.category4
            from Puzzles P
            left join Minis M on P.puzzle_type = 'mini' and P.puzzle_id = M.puzzle_id
            left join Connections C on P.puzzle_type = 'connections' and P.puzzle_id = C.puzzle_id
            where P.puzzle_id = %s;
            """,
            (puzzle_id,),
        )

        puzzle_out = await cur.fetchone()
        if not puzzle_out:
            raise HTTPException(
                status_code=404,
                detail="Puzzle not found",
            )
        puzzle_type = puzzle_out[0]
        score = 0
        message = {}

        try:
            if puzzle_type == "mini":
                solved, score, message = match_mini(
                    attempt=attempt, solution=puzzle_out[2]
                )
            elif puzzle_type == "connections":
                solved, score, message = match_connections(
                    attempt=attempt,
                    solution=puzzle_out[3],
                    categories=[
                        puzzle_out[4],
                        puzzle_out[5],
                        puzzle_out[6],
                        puzzle_out[7],
                    ],
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Invalid puzzle type.",
                )
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        message_str = json.dumps(message)
        attempt_out = await cur.execute(
            """
            insert into Attempts (user_id, puzzle_id, attempt, attempt_num, solved, score, message)
            values (%s, %s, %s, 0, %s, %s, %s)
            on conflict (user_id, puzzle_id)
            do update set
                attempt = excluded.attempt,
                attempt_num = Attempts.attempt_num + 1,
                solved = excluded.solved,
                score = excluded.score,
                message = excluded.message
            returning attempt_num;
            """,
            (
                user.user_id,
                puzzle_id,
                attempt,
                solved,
                score,
                message_str,
            ),
        )

        attempt_num = await cur.fetchone()
        if not attempt_out:
            raise HTTPException(
                status_code=500,
                detail="Failed to submit attempt",
            )

        attempt_num = attempt_num[0]
        await db.commit()
        return Attempt(
            user_id=user.user_id,
            username=user.username,
            puzzle_id=puzzle_id,
            puzzle_name=puzzle_out[1],
            attempt=attempt,
            attempt_num=attempt_num,
            score=score,
            updated_at=datetime.now(),
            solved=solved,
            message=message,
        )


@router.post("/{puzzle_id}/attempt-guest")
async def submit_attempt_guest(db: GetDB, puzzle_id: int, attempt: str) -> Attempt:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select 
                P.puzzle_type, P.puzzle_name,
                M.solution as MiniSolution,
                C.solution as ConnectionSolution,
                C.category1, C.category2, C.category3, C.category4
            from Puzzles P
            left join Minis M on P.puzzle_type = 'mini' and P.puzzle_id = M.puzzle_id
            left join Connections C on P.puzzle_type = 'connections' and P.puzzle_id = C.puzzle_id
            where P.puzzle_id = %s;
            """,
            (puzzle_id,),
        )

        puzzle_out = await cur.fetchone()
        if not puzzle_out:
            raise HTTPException(
                status_code=404,
                detail="Puzzle not found",
            )
        puzzle_type = puzzle_out[0]
        score = 0
        message = {}

        try:
            if puzzle_type == "mini":
                solved, score, message = match_mini(
                    attempt=attempt, solution=puzzle_out[2]
                )
            elif puzzle_type == "connections":
                solved, score, message = match_connections(
                    attempt=attempt,
                    solution=puzzle_out[3],
                    categories=[
                        puzzle_out[4],
                        puzzle_out[5],
                        puzzle_out[6],
                        puzzle_out[7],
                    ],
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Invalid puzzle type.",
                )
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        return Attempt(
            user_id=None,
            username="guest",
            puzzle_id=puzzle_id,
            puzzle_name=puzzle_out[1],
            attempt_num=0,
            score=score,
            updated_at=datetime.now(),
            solved=solved,
            message=message,
        )


@router.get("/{puzzle_id}/attempt")
async def get_current_attempt(db: GetDB, user: UserAuth, puzzle_id: int) -> None:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select 
                user_id, username, puzzle_id, puzzle_name, attempt, attempt_num,
                score, updated_at, solved, message
            from attempt_stats
            where user_id = %s and puzzle_id = %s;
            """,
            (user.user_id, puzzle_id),
        )
        attempt = await cur.fetchone()
        if not attempt:
            raise HTTPException(
                status_code=404,
                detail="Attempt not found",
            )
        return Attempt(
            user_id=attempt[0],
            username=attempt[1],
            puzzle_id=attempt[2],
            puzzle_name=attempt[3],
            attempt=attempt[4],
            attempt_num=attempt[5],
            score=attempt[6],
            updated_at=attempt[7],
            solved=attempt[8],
            message=attempt[9],
        )


@router.get("/{puzzle_id}/attempts")
async def get_leaderboard(db: GetDB, puzzle_id: int) -> list[Attempt]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select 
                user_id, username, puzzle_id, puzzle_name, attempt_num,
                score, updated_at, solved, message
            from attempt_stats
            where puzzle_id = %s
            order by score desc, updated_at desc;
            """,
            (puzzle_id,),
        )
        attempts = await cur.fetchall()
        return [
            Attempt(
                user_id=attempt[0],
                username=attempt[1],
                puzzle_id=attempt[2],
                puzzle_name=attempt[3],
                attempt_num=attempt[4],
                score=attempt[5],
                updated_at=attempt[6],
                solved=attempt[7],
                message={},
                attempt="",
            )
            for attempt in attempts
        ]
