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
    password: str
    is_admin: bool


class Puzzle(CamelModel):
    puzzle_id: int
    created_user_id: int
    puzzle_name: str
    updated_at: str
    puzzle_type: str


class Rating(CamelModel):
    user_id: int
    puzzle_id: int
    rating: int


class Attempt(CamelModel):
    user_id: int
    puzzle_id: int
    attempt_num: int
    score: int | None
    start_at: str
    finish_at: str | None
    tries: int


class Mini(CamelModel):
    puzzle_id: int
    solution: str
    gaps: str
    across1: str
    across2: str
    across3: str
    across4: str
    across5: str
    down1: str
    down2: str
    down3: str
    down4: str
    down5: str


class Connection(CamelModel):
    puzzle_id: int
    c1: str
    c1w1: str
    c1w2: str
    c1w3: str
    c1w4: str
    c2: str
    c2w1: str
    c2w2: str
    c2w3: str
    c2w4: str
    c3: str
    c3w1: str
    c3w2: str
    c3w3: str
    c3w4: str
    c4: str
    c4w1: str
    c4w2: str
    c4w3: str
    c4w4: str
