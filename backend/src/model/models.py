from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class User(CamelModel):
    user_id: int
    username: str
    is_admin: bool


class PuzzleStats(CamelModel):
    puzzle_id: int
    created_user_id: int
    created_username: str
    puzzle_name: str
    puzzle_type: str
    updated_at: datetime
    rating_ct: int
    rating_avg: float | None
    solved_ct: int


class Rating(CamelModel):
    user_id: int
    username: str
    puzzle_id: int
    puzzle_name: str
    puzzle_type: str
    rating: int
    updated_at: datetime


class Attempt(CamelModel):
    user_id: int | None
    username: str
    puzzle_id: int
    puzzle_name: str
    attempt: str
    attempt_num: int
    score: int
    updated_at: datetime
    solved: bool
    message: Any


class UserStats(CamelModel):
    user_id: int
    username: str
    is_admin: bool
    puzzle_ct: int
    solved_ct: int
    rating_ct: int
