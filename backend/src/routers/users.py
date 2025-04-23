from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing_extensions import Literal

from src.deps.auth import UserAuth
from src.deps.db import GetDB
from src.model.models import Attempt, PuzzleStats, Rating, User, UserStats

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


class Signup(BaseModel):
    username: str
    password: str


@router.post("/signup")
async def signup(db: GetDB, signup: Signup) -> User:
    async with db.cursor() as cur:
        try:
            await cur.execute(
                """
                insert into users (username, password, is_admin)
                values (%s, %s, false)
                returning user_id
                """,
                (signup.username, signup.password),
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail="Username already exists, or invalid username/password",
            ) from e
        user_id = await cur.fetchone()
        if not user_id:
            raise HTTPException(
                status_code=400,
                detail="Failed to create user",
            )
        return User(
            user_id=user_id[0],
            username=signup.username,
            is_admin=False,
        )


@router.get("/me")
async def me(user: UserAuth) -> User:
    return user


@router.get("/stats")
async def get_all_user_stats(
    db: GetDB, order_by: Literal["puzzle_ct", "rating_ct", "solved_ct"] | None = None
) -> list[UserStats]:
    async with db.cursor() as cur:
        await cur.execute(
            f"""
            select 
                user_id, username, is_admin, puzzle_ct, solved_ct, rating_ct 
            from user_stats
            order by {order_by if order_by else "puzzle_ct"} desc;
            """,
        )
        users_stats = [
            UserStats(
                user_id=user[0],
                username=user[1],
                is_admin=user[2],
                puzzle_ct=user[3],
                solved_ct=user[4],
                rating_ct=user[5],
            )
            for user in await cur.fetchall()
        ]
        return users_stats


@router.get("/{user_id}")
async def get_user(user_id: int, db: GetDB) -> User:
    async with db.cursor() as cur:
        await cur.execute(
            "select user_id, username, is_admin from users where user_id = %s",
            (user_id,),
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
                status_code=404,
                detail="User not found",
            )


@router.get("/{user_id}/puzzles")
async def get_user_puzzles(user_id: int, db: GetDB) -> list[PuzzleStats]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select puzzle_id, created_user_id, puzzle_name, puzzle_type, updated_at,
                rating_ct, rating_avg, solved_ct, username
            from puzzle_stats
            where created_user_id = %s;
            """,
            (user_id,),
        )
        puzzles = [
            PuzzleStats(
                puzzle_id=puzzle[0],
                created_user_id=puzzle[1],
                puzzle_name=puzzle[2],
                puzzle_type=puzzle[3],
                updated_at=puzzle[4],
                rating_ct=puzzle[5],
                rating_avg=puzzle[6],
                solved_ct=puzzle[7],
                created_username=puzzle[8],
            )
            for puzzle in await cur.fetchall()
        ]
        return puzzles


@router.get("/{user_id}/attempts")
async def get_user_attempts(user_id: int, db: GetDB) -> list[Attempt]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select 
                user_id, username, puzzle_id, puzzle_name, puzzle_type, attempt_num,
                duration, updated_at
            from attempt_stats
            where user_id = %s;
            """,
            (user_id,),
        )
        attempts = [
            Attempt(
                user_id=attempt[0],
                username=attempt[1],
                puzzle_id=attempt[2],
                puzzle_name=attempt[3],
                puzzle_type=attempt[4],
                attempt_num=attempt[5],
                duration=attempt[6],
                updated_at=attempt[7],
            )
            for attempt in await cur.fetchall()
        ]
        return attempts


@router.get("/{user_id}/ratings")
async def get_user_ratings(user_id: int, db: GetDB) -> list[Rating]:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select user_id, username, puzzle_id, puzzle_name, puzzle_type, rating, updated_at
            from rating_stats
            where user_id = %s;
            """,
            (user_id,),
        )
        ratings = [
            Rating(
                user_id=rating[0],
                username=rating[1],
                puzzle_id=rating[2],
                puzzle_name=rating[3],
                puzzle_type=rating[4],
                rating=rating[5],
                updated_at=rating[6],
            )
            for rating in await cur.fetchall()
        ]
        return ratings


@router.get("/{user_id}/stats")
async def get_user_stats(user_id: int, db: GetDB) -> UserStats:
    async with db.cursor() as cur:
        await cur.execute(
            """
            select user_id, username, is_admin, puzzle_ct, solved_ct, rating_ct 
            from user_stats
            where user_id = %s;
            """,
            (user_id,),
        )
        user = await cur.fetchone()
        if user:
            return UserStats(
                user_id=user[0],
                username=user[1],
                is_admin=user[2],
                puzzle_ct=user[3],
                solved_ct=user[4],
                rating_ct=user[5],
            )
        else:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )
