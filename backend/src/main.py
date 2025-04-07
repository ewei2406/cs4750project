import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.deps.lifespan import lifespan
from src.routers import puzzles, ratings, users

app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
app.include_router(ratings.router)
app.include_router(puzzles.router)


# Health check for kubernetes
@app.get("/healthz")
def health_check():
    return {"status": "ok"}


# Serve the UI
static_dir = "dist"
os.makedirs(static_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
