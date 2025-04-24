import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from src.deps.lifespan import lifespan
from src.routers import puzzles, ratings, users

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api")
app.include_router(ratings.router, prefix="/api")
app.include_router(puzzles.router, prefix="/api")


# Health check for kubernetes
@app.get("/healthz")
def health_check():
    return {"status": "ok"}


# Serve the UI
static_dir = "dist"
os.makedirs(static_dir, exist_ok=True)


@app.get("/{path:path}")
async def serve_ui(path: str):
    if path.endswith(".js") or path.endswith(".css"):
        return FileResponse(os.path.join(static_dir, path))
    else:
        return FileResponse(os.path.join(static_dir, "index.html"))
