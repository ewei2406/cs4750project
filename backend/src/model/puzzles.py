from typing import Literal, Union

from pydantic import Field
from src.model.models import CamelModel, PuzzleStats


class Mini(CamelModel):
    solution: str
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


class MiniDiscrim(CamelModel):
    type: Literal["mini"]
    data: Mini


class Connection(CamelModel):
    solution: str
    category1: str
    category2: str
    category3: str
    category4: str


class ConnectionDiscrim(CamelModel):
    type: Literal["connections"]
    data: Connection


class PuzzleUpdate(CamelModel):
    puzzle_name: str
    puzzle_data: Union[MiniDiscrim, ConnectionDiscrim] = Field(discriminator="type")


class Puzzle(PuzzleStats):
    puzzle_data: Union[MiniDiscrim, ConnectionDiscrim] = Field(discriminator="type")
