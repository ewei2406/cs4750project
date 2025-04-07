from typing import Literal, Union

from src.model.models import CamelModel


class Mini(CamelModel):
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


class MiniUpdate(Mini):
    type: Literal["mini"]


class Connection(CamelModel):
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


class ConnectionUpdate(Connection):
    type: Literal["connections"]


PuzzleUpdate = Union[MiniUpdate, ConnectionUpdate]
