import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends
from psycopg import AsyncConnection
from psycopg_pool import AsyncConnectionPool

load_dotenv()

DB_URL = os.getenv("DB_URL")

connection_pool: None | AsyncConnectionPool = None


async def init_db():
    global connection_pool
    if connection_pool is None:
        connection_pool = AsyncConnectionPool(
            DB_URL, open=False, min_size=1, max_size=1
        )
        await connection_pool.open()

    # Test the connection
    async with connection_pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT 1")
            await cur.fetchone()
            print("Database connection established.")


async def close_db():
    global connection_pool
    if connection_pool is not None:
        await connection_pool.close()
        connection_pool = None
        print("Database connection closed.")


async def get_db_connection():
    if connection_pool is None:
        raise Exception("Database connection pool is not initialized.")
    async with connection_pool.connection() as conn:
        yield conn


GetDB = Annotated[AsyncConnection, Depends(get_db_connection)]
