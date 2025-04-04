from fastapi import FastAPI
import os

from src.deps.lifespan import lifespan
from src.routers import attempts, puzzles, ratings, users
from fastapi.staticfiles import StaticFiles

app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
app.include_router(ratings.router)
app.include_router(puzzles.router)
app.include_router(attempts.router)


# Health check for kubernetes
@app.get("/healthz")
def health_check():
    return {"status": "ok"}

# Serve the UI
static_dir = 'dist'
os.makedirs(static_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")