import os
from asyncio import Lock
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends
from psycopg import AsyncConnection

load_dotenv()

DB_URL = os.getenv("DB_URL")

pg_conn: AsyncConnection = None
pg_lock = Lock()


async def init_db():
    global pg_conn
    if pg_conn is None:
        pg_conn = await AsyncConnection.connect(DB_URL)

    # Test the connection
    async with pg_lock:
        async with pg_conn.cursor() as cur:
            await cur.execute("SELECT 1")
            await cur.fetchone()
            print("Database connection established.")


async def close_db():
    global pg_conn
    if pg_conn is not None:
        async with pg_lock:
            await pg_conn.close()
            pg_conn = None
            print("Database connection closed.")


async def get_db_connection():
    if pg_conn is None:
        raise Exception("Database connection not initialized.")
    async with pg_lock:
        yield pg_conn


GetDB = Annotated[AsyncConnection, Depends(get_db_connection)]
