from fastapi import FastAPI

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
app.mount("/", StaticFiles(directory="dist", html=True), name="static")