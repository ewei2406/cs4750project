from contextlib import asynccontextmanager

from src.deps.db import close_db, init_db


@asynccontextmanager
async def lifespan(app):
    await init_db()
    yield
    await close_db()
